import { useState } from "react";;
import { useRouter } from 'next/navigation';
import UploadImageForm from "./UploadImageForm";

const NewProduct = ({ org }) => {
  const router = useRouter();


  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
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
  { name: '', price: '', quantity: '' },
]);

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
      const res = await fetch('/api/catalog/create-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productName,
          description,
          image,
          outofstock,
          varieties: varieties.map((v) => ({
            ...v,
            price: Number(v.price),
            quantity: Number(v.quantity),
          })),
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.error || 'Failed to create product');
  
      setSuccessMessage('Product created successfully!');
      // Optionally reset form:
      setProductName('');
      setDescription('');
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

        <h6>Varieties</h6>
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
              placeholder={`Price (${currency})`}
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
