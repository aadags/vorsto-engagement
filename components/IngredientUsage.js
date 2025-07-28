import { useEffect, useState } from "react";
import axios from "axios";

const ConfigureIngredientUsages = ({ productId }) => {
  const [inventories, setInventories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [rows, setRows] = useState([]); // [{ inventory_id, ingredients: [{ ingredient_id, usage_quantity, usage_weight }] }]
  const [newIngredients, setNewIngredients] = useState({}); // { new_123: { name, unit_type } }

  useEffect(() => {
    const fetchData = async () => {
      const [ingRes] = await Promise.all([
        axios.get("/api/catalog/get-ingredients"),
      ]);
      setIngredients(ingRes.data.data);
    };

    fetchData();
  }, []);

  const addInventoryRow = () => {
    setRows([...rows, { inventory_id: "", ingredients: [] }]);
  };

  const addIngredientToInventory = (inventoryIndex) => {
    const updated = [...rows];
    updated[inventoryIndex].ingredients.push({
      ingredient_id: "",
      usage_quantity: "",
      usage_weight: "",
    });
    setRows(updated);
  };

  const removeIngredientFromInventory = (inventoryIndex, ingredientIndex) => {
    const updated = [...rows];
    updated[inventoryIndex].ingredients = updated[inventoryIndex].ingredients.filter(
      (_, i) => i !== ingredientIndex
    );
    setRows(updated);
  };

  const removeInventoryRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const updateInventoryId = (index, value) => {
    const updated = [...rows];
    updated[index].inventory_id = value;
    setRows(updated);
  };

  const handleIngredientChange = (invIdx, ingIdx, field, value) => {
    const updated = [...rows];
    updated[invIdx].ingredients[ingIdx][field] = value;
    setRows(updated);
  };

  const handleNewIngredientChange = (tempId, field, value) => {
    setNewIngredients({
      ...newIngredients,
      [tempId]: {
        ...newIngredients[tempId],
        [field]: value,
      },
    });
  };

  const handleSelectExisting = (invIdx, ingIdx, ingredientId) => {
    // 1️⃣ Find the full ingredient object
    const sel = ingredients.find((i) => i.id === ingredientId);
    if (!sel) return;
  
    // 2️⃣ Update that one ingredient entry in rows,
    //    merging in the extra fields you want
    setRows((prev) =>
      prev.map((row, r) => {
        if (r !== invIdx) return row;
        return {
          ...row,
          ingredients: row.ingredients.map((ing, j) => {
            if (j !== ingIdx) return ing;
            return {
              ...ing,
              ingredient_id: sel.id,
              unit_type: sel.unit_type,
              // if you call your DB fields differently,
              // just map them here:
              available_quantity: sel.quantity,
              available_weight: sel.weight_available,
              price: sel.price,
            };
          }),
        };
      })
    );
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // 1️⃣ Collect every temp‑ID that starts with "new_"
    const tempIds = rows.reduce((set, row) => {
      row.ingredients.forEach((ing) => {
        if (ing.ingredient_id.startsWith("new_")) {
          set.add(ing.ingredient_id);
        }
      });
      return set;
    }, new Set());
  
    // 2️⃣ Build an array of only the new ingredient payloads
    const newPayloads = Array.from(tempIds).map((tempId) => ({
      tempId,
      data: newIngredients[tempId],
    }));
  
    // 3️⃣ Upsert all of them in parallel
    const entries = await Promise.all(
      newPayloads.map(async ({ tempId, data }) => {
        const res = await axios.post("/api/catalog/create-ingredient", data);
        return [tempId, res.data.id];
      })
    );
    const createdMap = Object.fromEntries(entries);
  
    // 4️⃣ Swap the tempIds for real IDs
    const preparedRows = rows.map((row) => ({
      inventory_id: row.inventory_id,
      ingredients: row.ingredients.map((ing) => ({
        ...ing,
        ingredient_id: ing.ingredient_id.startsWith("new_")
          ? createdMap[ing.ingredient_id]
          : ing.ingredient_id,
      })),
    }));
  
    // 5️⃣ Finally save usages
    await axios.post("/api/catalog/save-ingredient-usages", {
      rows: preparedRows,
    });
  
    alert("Ingredient usages saved successfully!");
  };
  

  const fetchProduct = async (id) => {
    
    const response = await axios.get(
    `/api/catalog/get-product2?id=${id}`
    );

    return response.data;
   };

   useEffect(() => {
    if (productId) {
      const fetchData = async () => {
        try {
          const product = await fetchProduct(productId);
  
          // Transform inventories with ingredient usages
          const prefilled = product.inventories.map((inv) => ({
            inventory_name: inv.inventory_name, // support both formats
            inventory_id: inv.inventory_id, // support both formats
            ingredients: inv.ingredients?.map((usage) => ({
              ingredient_id: usage.ingredient_id,
              usage_quantity: usage.usage_quantity,
              usage_weight: usage.usage_weight,
              unit_type: usage.unit_type,
            })) || [],
          }));
  
          setInventories(product.inventories); // if you still need this
          setRows(prefilled); // populate form rows
        } catch (error) {
          console.error("Failed to fetch product:", error);
        }
      };
  
      fetchData();
    }
  }, [productId]);
  

  return (
    <div className="form_container" style={{ width: "80%", margin: "0 auto" }}>
      <form onSubmit={handleSubmit}>
        {rows.map((row, idx) => (
          <div key={idx} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "2rem" }}>

            <h5>{row.inventory_name}</h5>

            {row.ingredients.map((usage, ingIdx) => {
              const isNew = usage.ingredient_id.startsWith("new_");

              return (
                <div key={ingIdx} style={{ border: "1px dashed #aaa", padding: "1rem", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <select
                      value={usage.ingredient_id}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "__new__") {
                          const newId = `new_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
                          handleIngredientChange(idx, ingIdx, "ingredient_id", newId);
                          setNewIngredients({
                            ...newIngredients,
                            [newId]: { name: "", unit_type: "unit" },
                          });
                        } else {
                          handleIngredientChange(idx, ingIdx, "ingredient_id", value);
                          handleSelectExisting(idx, ingIdx, value);
                        }
                      }}
                    >
                      <option value="">Select Ingredient</option>
                      <option value="__new__">+ Create New Ingredient</option>
                      {ingredients.map((ing) => (
                        <option key={ing.id} value={ing.id}>{ing.name}</option>
                      ))}
                      
                    </select>

                    {isNew && (
                      <>
                        <input
                          type="text"
                          placeholder="New Ingredient Name"
                          value={newIngredients[usage.ingredient_id]?.name || ""}
                          onChange={(e) => handleNewIngredientChange(usage.ingredient_id, "name", e.target.value)}
                          required
                        />
                        <select
                          value={newIngredients[usage.ingredient_id]?.unit_type || "unit"}
                          onChange={(e) => handleNewIngredientChange(usage.ingredient_id, "unit_type", e.target.value)}
                        >
                          <option value="unit">unit</option>
                          <option value="kg">kg</option>
                          <option value="g">g</option>
                          <option value="lb">lb</option>
                          <option value="ml">ml</option>
                        </select>
                      </>
                    )}

                    {newIngredients[usage.ingredient_id]?.unit_type === "unit" && <input
                      type="number"
                      placeholder="Usage Quantity"
                      value={usage.usage_quantity}
                      onChange={(e) => handleIngredientChange(idx, ingIdx, "usage_quantity", e.target.value)}
                    />} 
                    {newIngredients[usage.ingredient_id]?.unit_type === "ml" && <input
                      type="number"
                      placeholder="Usage Volume"
                      value={usage.usage_quantity}
                      onChange={(e) => handleIngredientChange(idx, ingIdx, "usage_quantity", e.target.value)}
                    />} 
                    {(newIngredients[usage.ingredient_id]?.unit_type === "lb" || newIngredients[usage.ingredient_id]?.unit_type === "kg" || newIngredients[usage.ingredient_id]?.unit_type === "g") && <input
                      type="number"
                      placeholder="Usage Weight"
                      value={usage.usage_weight}
                      onChange={(e) => handleIngredientChange(idx, ingIdx, "usage_weight", e.target.value)}
                    />}

                    {usage.unit_type === "unit" && <div className="currency-wrapper"><input
                      type="number"
                      placeholder="Usage Quantity"
                      value={usage.usage_quantity}
                      onChange={(e) => handleIngredientChange(idx, ingIdx, "usage_quantity", e.target.value)}
                    /><span className="currency-suffix">{usage.unit_type}</span></div>} 

                    {usage.unit_type === "ml" && <div className="currency-wrapper"><input
                      type="number"
                      placeholder="Usage Volume"
                      value={usage.usage_quantity}
                      onChange={(e) => handleIngredientChange(idx, ingIdx, "usage_quantity", e.target.value)}
                    /><span className="currency-suffix">{usage.unit_type}</span></div>} 

                    {(usage.unit_type === "lb" || usage.unit_type === "kg" || usage.unit_type === "g") && <div className="currency-wrapper"><input
                      type="number"
                      placeholder="Usage Weight"
                      value={usage.usage_weight}
                      onChange={(e) => handleIngredientChange(idx, ingIdx, "usage_weight", e.target.value)}
                    /><span className="currency-suffix">{usage.unit_type}</span></div>}
                    
                    {isNew && newIngredients[usage.ingredient_id]?.unit_type === "unit" && <input
                      type="number"
                      placeholder="Available Quantity"
                      value={newIngredients[usage.ingredient_id]?.available_quantity || ""}
                      onChange={(e) => handleNewIngredientChange(usage.ingredient_id, "available_quantity", e.target.value)}
                    />} 

                    {isNew && newIngredients[usage.ingredient_id]?.unit_type === "ml" && <input
                      type="number"
                      placeholder="Available Volume"
                      value={newIngredients[usage.ingredient_id]?.available_quantity || ""}
                      onChange={(e) => handleNewIngredientChange(usage.ingredient_id, "available_quantity", e.target.value)}
                    />} 

                    {isNew && (newIngredients[usage.ingredient_id]?.unit_type === "lb" || newIngredients[usage.ingredient_id]?.unit_type === "kg" || newIngredients[usage.ingredient_id]?.unit_type === "g") && <input
                      type="number"
                      placeholder="Available Weight"
                      value={newIngredients[usage.ingredient_id]?.available_weight || ""}
                      onChange={(e) => handleNewIngredientChange(usage.ingredient_id, "available_weight", e.target.value)}
                    />} 

                    <button
                      type="button"
                      className="techwave_fn_button"
                      style={{ backgroundColor: "gray" }}
                      onClick={() => removeIngredientFromInventory(idx, ingIdx)}
                    >
                      Remove Ingredient
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              className="techwave_fn_button"
              onClick={() => addIngredientToInventory(idx)}
            >
              + Add Ingredient
            </button>
          </div>
        ))}

        <br /><br />
        <button type="submit" className="techwave_fn_button">Save Usages</button>
      </form>
    </div>
  );
};

export default ConfigureIngredientUsages;
