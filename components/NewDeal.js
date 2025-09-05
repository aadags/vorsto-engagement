import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UploadImageForm from "./UploadImageForm";
import axios from "axios";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const NewDeal = ({ org, handleOnClick }) => {
  const router = useRouter();

  // Deal state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(""); // ONE_OFF | RECURRING
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [recurrence, setRecurrence] = useState(
    daysOfWeek.map((d) => ({ day: d, enabled: false, timeStart: "", timeEnd: "" }))
  );

  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [inventories, setInventories] = useState([]);
  const [selectedInventories, setSelectedInventories] = useState([
    { inventory_id: "", customPrice: "", discountType: "", discountValue: "" },
  ]);

  const [image, setImage] = useState([]);
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([
    { product_id: "", customPrice: "", discountType: "", discountValue: "" },
  ]);

  const fetchProducts = async () => {
    const response = await axios.get(`/api/catalog/get-combo-products`);
    setProducts(response.data.data);
  };

  const handleProductChange = (idx, field, value) => {
    const updated = [...selectedProducts];
    updated[idx][field] = value;
    setSelectedProducts(updated);
  };

  const addProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      { product_id: "", customPrice: "", discountType: "", discountValue: "" },
    ]);
  };

  const removeProduct = (idx) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== idx));
  };

  useEffect(() => {
    fetchInventories();
    fetchProducts();
  }, []);

  const fetchInventories = async () => {
    const response = await axios.get(`/api/catalog/get-inventories`);
    setInventories(response.data.data);
  };

  const handleInventoryChange = (idx, field, value) => {
    const updated = [...selectedInventories];
    updated[idx][field] = value;
    setSelectedInventories(updated);
  };

  const addInventory = () => {
    setSelectedInventories([
      ...selectedInventories,
      { inventory_id: "", customPrice: "", discountType: "", discountValue: "" },
    ]);
  };

  const removeInventory = (idx) => {
    setSelectedInventories(selectedInventories.filter((_, i) => i !== idx));
  };

  const setImages = (urls) => setImage(urls);

  const toggleDay = (dayIdx) => {
    const updated = [...recurrence];
    updated[dayIdx].enabled = !updated[dayIdx].enabled;
    setRecurrence(updated);
  };

  const setDayTime = (dayIdx, field, value) => {
    const updated = [...recurrence];
    updated[dayIdx][field] = value;
    setRecurrence(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/catalog/create-deal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          type,
          startDate,
          endDate,
          recurrence,
          discountType,
          discountValue,
          inventories: selectedInventories,
          products: selectedProducts,
          image,
          isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create deal");

      setSuccessMessage("Deal created successfully!");
      setTitle("");
      setDescription("");
      setDiscountValue("");
      setSelectedInventories([{ inventory_id: "", customPrice: "", discountType: "", discountValue: "" }]);
      handleOnClick(11)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form_container" style={{ width: "70%" }}>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form_group">
          <input
            type="text"
            className="full_width"
            placeholder="Deal Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <br />

        {/* Description */}
        <div className="form_group">
          <textarea
            className="full_width"
            placeholder="Deal Description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <br />

        {/* Deal Type */}
        <div className="form_group">
          <select
            className="full_width"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select Deal Type</option>
            <option value="ONE_OFF">One-off</option>
            <option value="RECURRING">Recurring</option>
          </select>
        </div>
        <br />

        {type === "ONE_OFF" && (
          <>
            <label>Start Date </label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            <br />
            <br />
            <label>End Date </label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            <br />
          </>
        )}

        {type === "RECURRING" && (
          <div className="recurrence-block" style={{ marginBottom: "1.5rem" }}>
            <h6 style={{ marginBottom: "0.75rem", fontWeight: 600 }}>Select Days & Time</h6>
            {recurrence.map((day, idx) => (
              <div
                key={day.day}
                className="day-row"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "1px solid #e5e7eb",
                  marginBottom: "0.75rem",
                }}
              >
                {/* Day checkbox + label */}
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    type="checkbox"
                    checked={day.enabled}
                    onChange={() => toggleDay(idx)}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <span>{day.day}</span>
                </label>

                {/* Time pickers */}
                {day.enabled && (
                  <div className="time-row" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <input
                      type="time"
                      value={day.timeStart}
                      onChange={(e) => setDayTime(idx, "timeStart", e.target.value)}
                      required
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "0.25rem 0.5rem",
                      }}
                    />
                    <input
                      type="time"
                      value={day.timeEnd}
                      onChange={(e) => setDayTime(idx, "timeEnd", e.target.value)}
                      required
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "0.25rem 0.5rem",
                      }}
                    />
                  </div>
                )}
              </div>
            ))}

            {/* Inline responsive CSS */}
            <style jsx>{`
              @media (min-width: 640px) {
                .day-row {
                  flex-direction: row !important;
                  align-items: center;
                  justify-content: space-between;
                }
                .time-row {
                  flex-direction: row !important;
                  align-items: center;
                  gap: 1rem !important;
                  flex: 1;
                }
                .time-row input {
                  width: 150px;
                }
              }
            `}</style>
          </div>
        )}

        <br />

        {/* Pricing Rule */}
        <div className="form_group">
          <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} required>
            <option value="">Select Discount Type</option>
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed Amount Deduction</option>
            <option value="FLAT_PRICE">Flat Price Override</option>
          </select>
        </div>
        <br />
        <input
          type="number"
          placeholder="Discount Value"
          value={discountValue}
          onChange={(e) => setDiscountValue(e.target.value)}
          required
        />
        <br />
        <br />

        {/* Inventories */}
        <hr/>
        <h6>Apply to Inventories (Default Products)</h6>
        {selectedInventories.map((inv, idx) => (
          <div key={idx} className="variety-row flex items-center mb-2">
            <select
              value={inv.inventory_id}
              onChange={(e) => handleInventoryChange(idx, "inventory_id", e.target.value)}
              className="border rounded px-2 py-1 flex-1"
              required
            >
              <option value="">Select Inventory</option>
              {inventories.map((invItem) => (
                <option key={invItem.id} value={invItem.id}>
                  {invItem.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Custom Price (optional)"
              value={inv.customPrice}
              onChange={(e) => handleInventoryChange(idx, "customPrice", e.target.value)}
              className="ml-2 border rounded px-2 py-1"
            />

            {(
              <button type="button" className="ml-2 techwave_fn_button" style={{ backgroundColor: "grey" }} onClick={() => removeInventory(idx)}>
                –
              </button>
            )}
          </div>
        ))}
        <button type="button" className="techwave_fn_button" onClick={addInventory}>
          + Add Inventory
        </button>
        <br />

        <hr/>

        {/* Products */}
        {org.type === "Food" && <><h6 className="mb-2">Apply to Combo Products</h6>
        <div className="space-y-3 mb-6">
          {selectedProducts.map((prod, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <select
                value={prod.product_id}
                onChange={(e) => handleProductChange(idx, "product_id", e.target.value)}
                className="border rounded px-2 py-1 flex-1"
                required
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <br/>

              <input
                type="number"
                placeholder="Custom Price (optional)"
                value={prod.customPrice}
                onChange={(e) => handleProductChange(idx, "customPrice", e.target.value)}
                className="border rounded px-2 py-1 w-32"
              />
              <br/>
              <br/>

              {(<>
                <button
                  type="button"
                  className="techwave_fn_button"
                  style={{ backgroundColor: "grey" }}
                  onClick={() => removeProduct(idx)}
                >
                  –
                </button>
                <br/></>

              )}
            </div>
          ))}
        </div>
        <button type="button" className="techwave_fn_button mb-6" onClick={addProduct}>
          + Add Product
        </button>
        <br/></>}

        {/* Status Toggle */}
        <div className="form_group">
          <label className="fn__toggle">
            <span className="t_in">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              <span className="t_slider" />
              <span className="t_content" />
            </span>
            Deal is Active
          </label>
        </div>
        <br />
        <br />

        {loading && <span>creating...</span>}
        {!loading && <button className="techwave_fn_button" type="submit">Create Deal</button>}
        <br />
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default NewDeal;
