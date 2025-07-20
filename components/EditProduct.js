import { useState, useEffect } from "react";;
import { useRouter } from 'next/navigation';
import UploadImageForm from "./UploadImageForm";
import axios from 'axios';

const EditProduct = ({ productId, org, cat }) => {
  const router = useRouter();

  const [productName, setProductName] = useState("");
  const [type, setType] = useState('');
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [currency] = useState(org.currency);
  const [outofstock, setOutofstock] = useState("");
  const [tax, setTax] = useState(0);
  const [taxType, setTaxType] = useState("");
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [varieties, setVarieties] = useState([]);
  const [stockImages, setStockImages] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [categories, setCategories] = useState(cat);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [comboItems, setComboItems] = useState([{ inventory_id: '', extra_price: '' }]);
  const [organization, setOrganization] = useState('');

  const addComboItem = () => {
    setComboItems([...comboItems, { inventory_id: '', extra_price: '' }]);
  };

  const removeComboItem = (index) => {
    setComboItems(comboItems.filter((_, i) => i !== index));
  };

  const handleComboChange = (index, field, value) => {
    const updated = [...comboItems];
    updated[index][field] = value;
    setComboItems(updated);
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
    setVarieties([...varieties, {
      name: '',
      barcode: '',
      price: '',
      quantity: '',
      price_unit: 'unit',
      weight_available: '',
      min_weight: '',
      weight_step: '',
    }]);
  };

  const removeVariety = async (v, index) => {
    if(v.id) {
      if (!window.confirm('Are you sure you want to permanently remove this variety? This cannot be undone.')) {
        return
      }
      await fetch('/api/catalog/delete-variety', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: v.id
        }),
      });
    }
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
      const res = await fetch('/api/catalog/update-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: productId,
          name: productName,
          type,
          description,
          sku,
          image,
          category: isNewCategory? newCategoryName : selectedCategory,
          newCategoryDescription,
          isNewCategory,
          outofstock,
          tax,
          taxType,
          varieties: varieties.map((v) => ({
            ...v,
            price: v.price,
            quantity: v.quantity,
            weight_available: v.weight_available,
            min_weight: v.min_weight,
            weight_step: v.weight_step,
          })),
          comboItems
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.error || 'Failed to update product');
  
      setSuccessMessage('Product updated successfully!');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProduct = async (id) => {
    
    const response = await axios.get(
    `/api/catalog/get-product?id=${id}`
    );

    return response.data;
};

useEffect(() => {
  if (productId) {
    const fetchData = async () => {
      try {
        const product = await fetchProduct(productId);
        console.log({ product });
        setProductName(product.name);
        setDescription(product.description);
        setSku(product.sku);
        setOutofstock(product.outofstock);
        setTax(product.tax)
        setTaxType(product.tax_type)
        setType(product.type)
        setVarieties(product.inventories);
        setSelectedCategory(product.category_id);
        setStockImages(product.images);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchData();
  }
}, [productId]);

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

      {productName && <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="form_group">
        <label>Product Name</label>
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
        <label>Product Type</label>
          <select
            id="type"
            className="full_width"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select Product Type</option>
            <option value="default">Default</option>
            <option value="combo">Combo</option>
        
            {/* Add more currencies as needed */}
          </select>
        </div>
        <br />

        {/* Product Description */}
        <div className="form_group">
        <label>Product Description</label>
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
        <label>Sku</label>
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
        <label>Category</label>
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
              placeholder="Enter new category name"
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

        {/* Currency */}
        <div className="form_group">
        <label>Tax Type</label>
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
        
        Tax Value <input
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

        {type === "default" &&<h6>Varieties</h6>}
        {type === "combo" &&<h6>Combos</h6>}
        {type === "default" && varieties.map((v, idx) => (
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

            {v.price_unit === 'unit' || !v.price_unit ? (
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
            
            {idx > 0 && <button type="button" className="techwave_fn_button" style={{ backgroundColor: "grey"}} onClick={() => removeVariety(v, idx)}>
              -
            </button>}

          </div>
        ))}
        {type === "default" && <button type="button" className="techwave_fn_button" onClick={addVariety}>
              +
            </button>}
        {type === "combo" && (
        <>
          {comboItems.map((item, idx) => (
            <div className="variety-row" key={idx}>
              <select value={item.inventory_id} onChange={(e) => handleComboChange(idx, 'inventory_id', e.target.value)}>
                <option value="">Select Inventory</option>
                {inventories.map(inv => (
                  <option key={inv.id} value={inv.id}>{inv.name}</option>
                ))}
              </select>
              <div className="currency-wrapper">
                <input
                  type="number"
                  placeholder="Extra Price"
                  value={item.extra_price}
                  onChange={(e) => handleComboChange(idx, 'extra_price', e.target.value)}
                  required
                /><span className="currency-suffix">{currency}</span>
                </div>
                {idx > 0 && <button type="button" className="techwave_fn_button" style={{ backgroundColor: "grey"}} onClick={() => removeComboItem(idx)}>
                    -
                  </button>}
            </div>
            
          ))}
          <button type="button" className="techwave_fn_button" onClick={addComboItem}>+ Add Item</button>
        </>
      )}
    
      <br />
      <br />

        <UploadImageForm setImages={setImages} existingImagesFromServer={stockImages} productId={productId} />
        <br /><br />

        {loading && <span>updating...</span>} 
        {!loading && <button className="techwave_fn_button" type="submit">Update Item</button>} 
        <br/>
        {successMessage}
      </form>}

    
    </div>
  );
};

export default EditProduct;
