'use client';

import { useState, useRef, useEffect } from 'react';

export default function UploadImageForm({ setImages, existingImagesFromServer }) {
  const [files, setFiles] = useState();
  const [message, setMessage] = useState('');
  const [uploaded, setUploaded] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleSetDefault = async (e) => {
  }
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!files?.length) {
      setMessage('Please select at least one file.');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    for (const file of Array.from(files)) {
      formData.append('file', file);
    }

    const res = await fetch('/api/catalog/upload-image', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    if (res.ok) {
      setMessage(`Uploaded ${result.files.length} file(s) successfully`);
      setUploaded((prev) => [...prev, ...result.files]);
      setImages((prev) => [...prev, ...result.files]);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } else {
      setMessage(result.error || 'Upload failed');
    } 
    setIsSubmitting(false);
  };

  const handleDelete = async (id, cloud_id, type) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return
    }
    const res = await fetch('/api/catalog/delete-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, cloud_id }),
    });

    const result = await res.json();
    if (res.ok) {
      setMessage('Image deleted.');

      if (type === 'uploaded') {
        setUploaded((prev) => prev.filter((img) => img.public_id !== cloud_id));
      } else {
        setExistingImages((prev) => prev.filter((img) => img.cloud_id !== cloud_id));
      }
    } else {
      setMessage(result.error || 'Failed to delete image.');
    }
  };

  useEffect(() => {
    setExistingImages([])

    if(existingImagesFromServer && existingImagesFromServer.length > 0){
      setExistingImages([ ...existingImagesFromServer ]);
    }

  }, [existingImagesFromServer]);

  return (
    <div className="p-6">
      <span style={{ color: "green" }}>800kb max per image</span>
      <form style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingBottom: "0.5em" }}>
      <div className="form_group">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles(e.target.files)}
          ref={fileInputRef}
          className="block mb-4"
        />
        </div>
        <button
          type="button"
          onClick={handleImageSubmit}
          disabled={isSubmitting}
          className="techwave_fn_button"
        >
          {isSubmitting? "Uploading" : "Upload Images"}
        </button>
      </form>

      {message && <p style={{ color: "red" }}>{message}</p>}
      <br/>
      {uploaded.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingBottom: "0.5em", width: "100%" }}>
          {uploaded.map((img, idx) => (
            <div>
            <img key={idx} src={img.url} alt={`Uploaded ${idx}`} className="w-full" width="200px" />
            <br/>
            <a onClick={() => handleDelete("0", img.public_id, 'uploaded')}>Delete</a>
            </div>
          ))}
        </div>
      )}
      <br/>

      {existingImages && existingImages.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingBottom: "0.5em", width: "100%" }}>
          {existingImages.map((img, idx) => (
            <div key={img.id || idx}>
              <img src={img.url} alt={`Current Image ${idx}`} className="w-full" width="200px" />
              <br />
              <a onClick={() => handleDelete(img.id, img.cloud_id, 'existing')}>Delete</a>
              <br />
              {img.default ? (
                <span style={{ color: "green", fontWeight: "bold" }}>Default</span>
              ) : (
                <button onClick={() => handleSetDefault(img.id)}>Set as Default</button>
              )}
            </div>
          ))}
        </div>
        
        )
      }
    </div>
  );
}
