import { useState, useEffect } from "react";;
import { useRouter } from 'next/navigation';
import UploadImageForm from "./UploadImageForm";
import axios from 'axios';

const EditCategory = ({ catId, org }) => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
  
  
    try {
      const res = await fetch('/api/catalog/update-cat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: catId,
          name,
          description,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.error || 'Failed to update category');
  
      setSuccessMessage('Category updated successfully!');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategory = async (id) => {
    
    const response = await axios.get(
    `/api/catalog/get-cat?id=${id}`
    );

    return response.data;
};

useEffect(() => {
  if (catId) {
    const fetchData = async () => {
      try {
        const category = await fetchCategory(catId);
        setName(category.name);
        setDescription(category.description);
      } catch (error) {
        console.error("Failed to fetch category:", error);
      }
    };

    fetchData();
  }
}, [catId]);


  return (
    <div className="form_container" style={{ width: "70%" }}>

      {name && <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="form_group">
          <input
            type="text"
            id="product_name"
            className="full_width"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

        {loading && <span>updating...</span>} 
        {!loading && <button className="techwave_fn_button" type="submit">Update Category</button>} 
        <br/>
        {successMessage}
      </form>}

    
    </div>
  );
};

export default EditCategory;
