import { useState, useEffect } from "react";;
import { useRouter } from 'next/navigation';
import UploadImageForm from "./UploadImageForm";
import axios from 'axios';

const ViewProduct = ({ productId, org }) => {
  const router = useRouter();

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [outofstock, setOutofstock] = useState("");
  const [currency] = useState(org.currency);
  const [tax, setTax] = useState(0);
  const [taxType, setTaxType] = useState("");
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
        setCategory(product.category.name);
        setOutofstock(product.outofstock);
        setVarieties(product.inventories);
        setStockImages(product.images);
        setTax(product.tax)
        setTaxType(product.tax_type)
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchData();
  }
}, [productId]);


  return (
    <div className="form_container" style={{ width: "70%" }}>

      {productName && <form>
        {/* Product Name */}
        <div className="form_group">
          <h6>Name: {productName}</h6>
        </div>

        {/* Product Description */}
        <div className="form_group">
          <h6>Description: {description}</h6>
        </div>

        {/* Product Sku */}
        <div className="form_group">
          <h6>Sku: {sku}</h6>
        </div>

        <div className="form_group">
          <h6>Category: {category}</h6>
        </div>

        {/* Currency */}
        <div className="form_group">
          <h6>Tax: {tax} ({taxType})</h6>
        </div>

        <label className="fn__toggle">
            Selling When Out of Stock:
                  <span className="t_in">
                    <input 
                      type="checkbox" 
                      checked={outofstock} 
                      id="outofstock" 
                      readOnly
                    />

                    <span className="t_slider" />
                    <span className="t_content" />
                  </span>
                </label>
                <br /><br />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4rem",
                    paddingBottom: "0.5em",
                    fontWeight: "bold",
                  }}
                >
                  <span style={{ width: "16%" }}>Variety</span>
                  <span style={{ width: "16%" }}>{`Price (${currency})`}</span>
                  <span style={{ width: "16%" }}>Stock</span>
                </div>

                {varieties.map((v, idx) => {
                  const isWeight = v.price_unit === "kg" || v.price_unit === "lb";
                  const unitLabel = v.price_unit === "kg" ? "kg"
                                  : v.price_unit === "lb" ? "lb"
                                  : "unit";

                  return (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4rem",
                        paddingBottom: "0.5em",
                      }}
                    >
                      <span style={{ width: "16%" }}>{v.name}</span>
                      <span style={{ width: "16%" }}>{(v.price).toFixed(2)} {currency}</span>
                      <span style={{ width: "16%" }}>{unitLabel === "unit"? v.quantity : v.weight_available} {unitLabel}</span>
                      
                    </div>
                  );
                })}

    
      <br />
      <br />

      {stockImages && stockImages.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingBottom: "0.5em", width: "100%" }}>
          {stockImages.map((img, idx) => (
            <div>
              <img key={idx} src={img.url} alt={`Current Image ${idx}`} className="w-full" width="200px" />
            </div>
          ))}
        </div>
        )
      }
        <br /><br />

      </form>}

    
    </div>
  );
};

export default ViewProduct;
