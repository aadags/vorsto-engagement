import { useState, useEffect } from "react";;
import { useRouter } from 'next/navigation';
import UploadImageForm from "./UploadImageForm";
import axios from 'axios';

const EditProduct = ({ productId, org, cat }) => {
  const router = useRouter();

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
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
    setVarieties([...varieties, { name: '', price: '', quantity: '' }]);
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
          description,
          image,
          category: isNewCategory? newCategoryName : selectedCategory,
          newCategoryDescription,
          isNewCategory,
          outofstock,
          tax,
          taxType,
          varieties: varieties.map((v) => ({
            ...v,
            price: Number(v.price),
            quantity: Number(v.quantity),
          })),
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
        setOutofstock(product.outofstock);
        setTax(product.tax)
        setTaxType(product.tax_type)
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


  return (
    <div className="form_container" style={{ width: "70%" }}>

      {productName && <form onSubmit={handleSubmit}>
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

        <h6>Varieties</h6>
        {varieties.map((v, idx) => (
          <div key={idx} className="variety-row">
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
                placeholder="Price"
                value={v.price}
                onChange={(e) => handleVarietyChange(idx, 'price', e.target.value)}
                required
              />
              <span className="currency-suffix">{currency}</span>
            </div>

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
            {idx > 0 && <button type="button" className="techwave_fn_button" onClick={() => removeVariety(v, idx)}>
              -
            </button>}
          </div>
        ))}
        <button type="button" className="techwave_fn_button" onClick={addVariety}>
              +
            </button>
    
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
