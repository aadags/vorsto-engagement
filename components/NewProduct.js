import { useEffect, useState } from "react";;
import { useRouter } from 'next/navigation';
import UploadImageForm from "./UploadImageForm";
import axios from "axios";

const NewProduct = ({ org, cat }) => {
  const router = useRouter();

  const [productName, setProductName] = useState('');
  const [type, setType] = useState();
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [currency] = useState(org.currency);
  const [outofstock, setOutofstock] = useState(false);
  const [display, setDisplay] = useState(true);
  const [tax, setTax] = useState();
  const [taxType, setTaxType] = useState("");
  const [comboPrice, setComboPrice] = useState(''); 
  const [image, setImage] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [successMessage, setSuccessMessage] = useState('');
const [varieties, setVarieties] = useState([
  { name: '', barcode: '', price: '', quantity: '', price_unit: 'unit', weight_available: '', min_weight: '', weight_step: '' },
]);
const [categories, setCategories] = useState(cat);
const [selectedCategory, setSelectedCategory] = useState("");
const [isNewCategory, setIsNewCategory] = useState(false);
const [newCategoryName, setNewCategoryName] = useState("");
const [newCategoryDescription, setNewCategoryDescription] = useState("");
const [comboOptions, setComboOptions] = useState([
  { required: true, items: [{ inventory_id: '', extra_price: '' }] }
]);
const [organization, setOrganization] = useState('');

const addOption = () => {
  setComboOptions([
    ...comboOptions,
    { required: true, items: [{ inventory_id: '', extra_price: '' }] }
  ]);
};

// update a field on a specific inventory slot
const handleOptionChange = (optIdx, field, value) => {
  const next = comboOptions.map((opt, i) => {
    return i === optIdx ? { ...opt, [field]: value } : opt
  });
  setComboOptions(next);
};

// remove an entire option
const removeOption = (optIdx) => {
  setComboOptions(comboOptions.filter((_, i) => i !== optIdx));
};
const addInventorySlot = (optIdx) => {
  const next = comboOptions.map((opt, i) =>
    i === optIdx
      ? { 
          ...opt, 
          items: [...opt.items, { inventory_id: '', extra_price: '' }] 
        }
      : opt
  );
  setComboOptions(next);
};

// remove one inventory slot from an option
const removeInventorySlot = (optIdx, itemIdx) => {
  const next = comboOptions.map((opt, i) => {
    if (i !== optIdx) return opt;
    return {
      ...opt,
      items: opt.items.filter((_, j) => j !== itemIdx)
    };
  });
  setComboOptions(next);
};

// update a field on a specific inventory slot
const handleInventoryChange = (optIdx, itemIdx, field, value) => {
  const next = comboOptions.map((opt, i) => {
    if (i !== optIdx) return opt;
    const newItems = opt.items.map((itm, j) =>
      j === itemIdx ? { ...itm, [field]: value } : itm
    );
    return { ...opt, items: newItems };
  });
  setComboOptions(next);
};

const handleCategoryChange = (e) => {
  const value = e.target.value;
  if (value === "__new__") {
    setIsNewCategory(true);
    setSelectedCategory("");
  } else {
    setIsNewCategory(false);
    setSelectedCategory(value);
  }
};

const addVariety = () => {
  setVarieties([...varieties, { name: '', barcode: '', price: '', quantity: '', price_unit: 'unit', weight_available: '', min_weight: '', weight_step: '' }]);
};

const removeVariety = (index) => {
  setVarieties(varieties.filter((_, i) => i !== index));
};


const setImages = (urls) => {
  setImage(urls)
};

const handleVarietyChange = (index, field, value) => {
  const updated = [...varieties];
  updated[index][field] = value;
  setVarieties(updated);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
  
  
    try {
      const res = await fetch('/api/catalog/create-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productName,
          type,
          comboPrice,
          description,
          sku,
          image,
          tax,
          taxType,
          category: isNewCategory? newCategoryName : selectedCategory,
          newCategoryDescription,
          isNewCategory,
          outofstock,
          display,
          varieties: varieties.map((v) => ({
            ...v,
            price: v.price,
            quantity: v.quantity,
            weight_available: v.weight_available,
            min_weight: v.min_weight,
            weight_step: v.weight_step,
          })),
          comboOptions
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.error || 'Failed to create product');
  
      setSuccessMessage('Product created successfully!');
      // Optionally reset form:
      setProductName('');
      setDescription('');
      setSku('');
      setComboPrice('');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventories = async () => {

    const response = await axios.get(
      `/api/catalog/get-inventories`
    );

    setInventories(response.data.data);
  };

  useEffect(() => {
    const fetchOrg = async () => {
      
      const response = await axios.get(`/api/get-org-details`);
      const org = response.data;
      setOrganization(org);
    };
    fetchOrg();
    fetchInventories(); // fetch page 1 of users
  }, []);
  

  return (
    <div className="form_container" style={{ width: "70%" }}>

      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="form_group">
          <input
            type="text"
            id="product_name"
            className="full_width"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <br />

        <div className="form_group">
          <select
            id="type"
            className="full_width"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select Product Type</option>
            <option value="default">Default</option>
            {organization.type === "Food" && <option value="combo">Combo</option>}
        
            {/* Add more currencies as needed */}
          </select>
        </div>
        <br />

        {/* Product Description */}
        <div className="form_group">
          <textarea
            id="product_description"
            className="full_width"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            style={{ resize: 'vertical', overflow: 'auto' }}
            placeholder="Product Description"
            required
          />
        </div>
        <br />
        {/* Product sku */}
        {organization.type !== "Food" && <div className="form_group">
        <input
            type="text"
            id="product_sku"
            className="full_width"
            placeholder="Product Sku (Optional)"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
        </div>}
        <br />

        <div className="form_group">
          <select
            id="category"
            className="full_width"
            value={isNewCategory ? "__new__" : selectedCategory}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat.id}>
                {cat.name}
              </option>
            ))}
            <option value="__new__">+ Create New Category</option>
          </select>

          {isNewCategory && <br />}
          {isNewCategory && (<>
            <input
              type="text"
              placeholder="New Category Name"
              className="full_width"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              required
            />
            <br/><br/>
            <input
              type="text"
              placeholder="New Category Description"
              className="full_width"
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
              required
            />
            </>
          )}
        </div>
        <br />

        <div className="form_group">
          <select
            id="tax"
            className="full_width"
            value={taxType}
            onChange={(e) => setTaxType(e.target.value)}
            required
          >
            <option value="">Select Tax Type</option>
            <option value="percentage">Percentage</option>
            <option value="flatfee">Flat Fee</option>
        
            {/* Add more currencies as needed */}
          </select>
        </div>
        <br />
        
        <div className="form_group"><input
              type="number"
              placeholder="Tax Value"
              value={tax}
              onChange={(e) => setTax(e.target.value)}
              required
            />
        </div>
        <br />

        {type === "combo" && <div className="currency-wrapper">
              <input
                type="number"
                className="currency-input"
                placeholder="Combo Price"
                value={comboPrice}
                onChange={(e) => setComboPrice(e.target.value)}
                required
              />
              <span className="currency-suffix">{currency}</span>
            </div>}
        <br /><br />

        {organization.type !== "Food" &&<> <div className="form_group"><label className="fn__toggle">
                  <span className="t_in">
                    <input 
                      type="checkbox" 
                      checked={outofstock} 
                      id="outofstock" 
                      onChange={(e) => setOutofstock(e.target.checked)} 
                    />

                    <span className="t_slider" />
                    <span className="t_content" />
                  </span>
                  Continue Selling When Out of Stock
                </label></div>
                <br /></>}

                <div className="form_group"><label className="fn__toggle">
                  <span className="t_in">
                    <input 
                      type="checkbox" 
                      checked={display} 
                      id="display" 
                      onChange={(e) => setDisplay(e.target.checked)} 
                    />

                    <span className="t_slider" />
                    <span className="t_content" />
                  </span>
                  Display product on store front
                </label></div>
                <br />

        {type === "default" &&<h6>Varieties</h6>}
        {type === "combo" &&<h6>Combos</h6>}
        {type === "default" && varieties.map((v, idx) => (
          <div key={idx} className="variety-row">

            {organization.type !== "Food" && <select
              value={v.price_unit}
              onChange={(e) => handleVarietyChange(idx, 'price_unit', e.target.value)}
            >
              <option value="">Select Price Unit</option>
              <option value="unit">Unit</option>
              <option value="kg">Weight (kg)</option>
              <option value="lb">Weight (lb)</option>
            </select>}

            <input
              type="text"
              type="text"
              placeholder="Variety"
              value={v.name}
              onChange={(e) => handleVarietyChange(idx, 'name', e.target.value)}
              required
            />
            <div className="currency-wrapper">
              <input
                type="number"
                className="currency-input"
                placeholder="Unit Price"
                value={v.price}
                onChange={(e) => handleVarietyChange(idx, 'price', e.target.value)}
                required
              />
              <span className="currency-suffix">{currency}</span>
            </div>

            {organization.type !== "Food" && <input
              type="text"
              type="text"
              placeholder="Barcode (optional)"
              value={v.barcode}
              onChange={(e) => handleVarietyChange(idx, 'barcode', e.target.value)}
            />}

            {v.price_unit === 'unit' ? (
              organization.type !== "Food" && (<div className="currency-wrapper">
                <input
                  type="number"
                  className="currency-input"
                  placeholder="Stock Quantity"
                  value={v.quantity}
                  onChange={(e) => handleVarietyChange(idx, 'quantity', e.target.value)}
                  required
                />
                <span className="currency-suffix">Units</span>
              </div>)
            ) : (
              <>
                <div className="currency-wrapper">
                  <input
                    type="number"
                    className="currency-input"
                    placeholder="Available Weight"
                    value={v.weight_available}
                    onChange={(e) => handleVarietyChange(idx, 'weight_available', e.target.value)}
                    required
                  />
                  <span className="currency-suffix">{varieties[idx].price_unit}</span>
                </div>
                <div className="currency-wrapper">
                <input
                  type="number"
                  placeholder="Minimum Weight"
                  value={v.min_weight}
                  onChange={(e) => handleVarietyChange(idx, 'min_weight', e.target.value)}
                  required
                /><span className="currency-suffix">{varieties[idx].price_unit}</span>
                </div>
                <div className="currency-wrapper">
                <input
                  type="number"
                  placeholder="Unit Weight"
                  value={v.weight_step}
                  onChange={(e) => handleVarietyChange(idx, 'weight_step', e.target.value)}
                  required
                />
                <span className="currency-suffix">{varieties[idx].price_unit}</span>
                </div>
              </>
            )}

            {idx > 0 && <button type="button" className="techwave_fn_button" style={{ backgroundColor: "grey"}} onClick={() => removeVariety(idx)}>
              -
            </button>}
          </div>
        ))}
        {type === "default" && <button type="button" className="techwave_fn_button" onClick={addVariety}>
              +
            </button>}
    
            {type === "combo" && (
            <>
              {comboOptions.map((opt, optIdx) => (
                <div key={optIdx} className="option-block border p-4 mb-4">
                  <hr/>
                  <div className="option-caption font-semibold mb-2">
                    Option {optIdx + 1}

                    {comboOptions.length > 1 && (
                      <button
                      type="button"
                      style={{
                        marginLeft: '1rem',
                        fontSize: '0.875rem',
                        color: 'red',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                      onClick={() => removeOption(optIdx)}
                    >
                      X Remove Option
                    </button>
                    
                    )}
                  </div>
                  <br/>

                  <div className="form_group"><label className="fn__toggle">
                    <span className="t_in">
                      <input 
                        type="checkbox" 
                        checked={opt.required} 
                        id="display" 
                        onChange={(e) => handleOptionChange(optIdx, "required", e.target.checked)} 
                      />

                      <span className="t_slider" />
                      <span className="t_content" />
                    </span>
                    Option is Required
                  </label></div>
                  <br />

                  <div className="form_group">
                    <label className="block text-xs text-gray-300 mb-1">Label </label>
                    <input
                      type="text"
                      value={opt.label ?? ''}
                      onChange={(e) => handleOptionChange(optIdx, 'label', e.target.value)}
                      className="w-full border rounded px-3 py-2 bg-transparent"
                      placeholder="e.g Main Dish / Add-ons"
                    />
                  </div><br/>

                  <div className="form_group">
                      <label className="block text-xs text-gray-300 mb-1">Min Selection </label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={opt.min ?? ''}
                        onChange={(e) => handleOptionChange(optIdx, 'min', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full border rounded px-3 py-2 bg-transparent"
                        placeholder={opt.required ? '1' : '0'}
                      />
                    </div><br/>

                  <div className="form_group">
                      <label className="block text-xs text-gray-300 mb-1">Max Selection </label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={opt.max ?? ''}
                        onChange={(e) => handleOptionChange(optIdx, 'max', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full border rounded px-3 py-2 bg-transparent"
                        placeholder="1 for single choice"
                      />
                    </div><br/>


                  {opt.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="variety-row flex items-center mb-2">
                      {/* Inventory select */}
                      <select
                        value={item.inventory_id}
                        onChange={(e) =>
                          handleInventoryChange(optIdx, itemIdx, "inventory_id", e.target.value)
                        }
                        className="border rounded px-2 py-1 flex-1"
                        required
                      >
                        <option value="">Select Inventory</option>
                        {inventories.map((inv) => (
                          <option key={inv.id} value={inv.id}>
                            {inv.name}
                          </option>
                        ))}
                      </select>

                      {/* Extra price */}
                      <div className="currency-wrapper ml-4 flex items-center">
                        <input
                          type="number"
                          placeholder="Extra Price"
                          value={item.extra_price}
                          onChange={(e) =>
                            handleInventoryChange(optIdx, itemIdx, "extra_price", e.target.value)
                          }
                          className="border rounded px-2 py-1 w-24"
                          required
                        />
                        <span className="currency-suffix ml-1">{currency}</span>
                      </div>

                      {/* Remove inventory slot */}
                      {opt.items.length > 1 && (
                        <button
                          type="button"
                          className="ml-4 techwave_fn_button"
                          style={{ backgroundColor: "grey" }}
                          onClick={() => removeInventorySlot(optIdx, itemIdx)}
                        >
                          –
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    className="mt-2 techwave_fn_button"
                    onClick={() => addInventorySlot(optIdx)}
                  >
                    + Add Inventory to Option {optIdx + 1}
                  </button>
                  <br/>
                </div>
              ))}

              <button type="button" className="techwave_fn_button" onClick={addOption}>
                + Add New Option
              </button>
            </>
          )}


      <br />
      <br />

        <UploadImageForm setImages={setImages} />
        <br /><br />

        {type === "default" && organization.type === "Food" && <p style={{color: "green"}}>Setup your ingredients after product creation to track your inventory</p>}

        {loading && <span>creating...</span>} 
        {!loading && <button className="techwave_fn_button" type="submit">Create Item</button>} 
        <br/>
        {successMessage}
      </form>

    
    </div>
  );
};

export default NewProduct;
