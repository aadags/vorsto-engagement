import { useState } from "react";;
import { useRouter } from 'next/navigation';
import UploadImageForm from "./UploadImageForm";

const NewProduct = ({ org, cat }) => {
  const router = useRouter();

  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [currency] = useState(org.currency);
  const [outofstock, setOutofstock] = useState(false);
  const [tax, setTax] = useState();
  const [taxType, setTaxType] = useState("");
  const [price, setPrice] = useState(''); // Store as string for input, convert to number on submit
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [successMessage, setSuccessMessage] = useState('');
const [varieties, setVarieties] = useState([
  { name: '', barcode: '', price: '', quantity: '', price_unit: '', weight_available: '', min_weight: '', weight_step: '' },
]);
const [categories, setCategories] = useState(cat);
const [selectedCategory, setSelectedCategory] = useState("");
const [isNewCategory, setIsNewCategory] = useState(false);
const [newCategoryName, setNewCategoryName] = useState("");
const [newCategoryDescription, setNewCategoryDescription] = useState("");

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
  setVarieties([...varieties, { name: '', barcode: '', price: '', quantity: '', price_unit: '', weight_available: '', min_weight: '', weight_step: '' }]);
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
          description,
          sku,
          image,
          tax,
          taxType,
          category: isNewCategory? newCategoryName : selectedCategory,
          newCategoryDescription,
          isNewCategory,
          outofstock,
          varieties: varieties.map((v) => ({
            ...v,
            price: v.price,
            quantity: v.quantity,
            weight_available: v.weight_available,
            min_weight: v.min_weight,
            weight_step: v.weight_step,
          })),
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.error || 'Failed to create product');
  
      setSuccessMessage('Product created successfully!');
      // Optionally reset form:
      setProductName('');
      setDescription('');
      setSku('');
      setPrice('');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

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
        <div className="form_group">
        <input
            type="text"
            id="product_sku"
            className="full_width"
            placeholder="Product Sku (Optional)"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
        </div>
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
        
        <input
              type="number"
              placeholder="Tax Value"
              value={tax}
              onChange={(e) => setTax(e.target.value)}
              required
            />
        <br /><br />

        <label className="fn__toggle">
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
                </label>
                <br /><br />

        <h6>Varieties & Sub Varieties</h6>
        {varieties.map((v, idx) => (
          <div key={idx} className="variety-row">

            <select
              value={v.price_unit}
              onChange={(e) => handleVarietyChange(idx, 'price_unit', e.target.value)}
            >
              <option value="">Select Price Unit</option>
              <option value="unit">Unit</option>
              <option value="kg">Weight (kg)</option>
              <option value="lb">Weight (lb)</option>
            </select>

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

            <input
              type="text"
              type="text"
              placeholder="Barcode (optional)"
              value={v.barcode}
              onChange={(e) => handleVarietyChange(idx, 'barcode', e.target.value)}
            />

            {v.price_unit === 'unit' ? (
              <div className="currency-wrapper">
                <input
                  type="number"
                  className="currency-input"
                  placeholder="Stock Quantity"
                  value={v.quantity}
                  onChange={(e) => handleVarietyChange(idx, 'quantity', e.target.value)}
                  required
                />
                <span className="currency-suffix">Units</span>
              </div>
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
        <button type="button" className="techwave_fn_button" onClick={addVariety}>
              +
            </button>
    
      <br />
      <br />

        <UploadImageForm setImages={setImages} />
        <br /><br />

        {loading && <span>creating...</span>} 
        {!loading && <button className="techwave_fn_button" type="submit">Create Item</button>} 
        <br/>
        {successMessage}
      </form>

    
    </div>
  );
};

export default NewProduct;
