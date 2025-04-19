import { useState, useEffect } from "react";;
import { useRouter } from 'next/navigation';
import UploadImageForm from "./UploadImageForm";
import axios from 'axios';

const EditProduct = ({ productId }) => {
  const router = useRouter();

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [outofstock, setOutofstock] = useState("");
  const [currency, setCurrency] = useState("");
  const [stripeProductId, setStripeProductId] = useState("");
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [varieties, setVarieties] = useState([]);
  const [stockImages, setStockImages] = useState([]);

const addVariety = () => {
  setVarieties([...varieties, { name: '', price: '', quantity: '' }]);
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
      const res = await fetch('/api/catalog/update-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: productId,
          name: productName,
          description,
          image,
          stripeProductId: stripeProductId,
          currency,
          outofstock,
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
        setCurrency(product.currency);
        setVarieties(product.inventories);
        setStripeProductId(product.stripeProductId);
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

        {/* Currency */}
        <div className="form_group">
          <select
            id="currency"
            className="full_width"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
          >
            <option value="">Select Currency</option>
            <option value="usd">USD</option>
            <option value="cad">CAD</option>
            <option value="eur">EUR</option>
            {/* Add more currencies as needed */}
          </select>
        </div>
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
        <div style={{ display: "flex", alignItems: "center", gap: "12.0rem", paddingLeft: "3em", paddingBottom: "0.5em" }}>
            <span>Variety</span>
            <span>{`Price (${currency})`}</span>
            <span>Quantity</span>
        </div>
        {varieties.map((v, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingBottom: "0.5em" }}>
            <input
              type="text"
              placeholder="Variety"
              value={v.name}
              onChange={(e) => handleVarietyChange(idx, 'name', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={v.price}
              onChange={(e) => handleVarietyChange(idx, 'price', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={v.quantity}
              onChange={(e) => handleVarietyChange(idx, 'quantity', e.target.value)}
              required
            />
            <button type="button" className="techwave_fn_button" onClick={addVariety}>
              +
            </button>
            <button type="button" className="techwave_fn_button" onClick={() => removeVariety(idx)}>
              -
            </button>
          </div>
        ))}
    
      <br />
      <br />

        <UploadImageForm setImages={setImages} existingImagesFromServer={stockImages} />
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
