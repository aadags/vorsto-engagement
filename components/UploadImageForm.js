'use client';

import { useState } from 'react';

export default function UploadImageForm({ setImages }) {
  const [files, setFiles] = useState();
  const [message, setMessage] = useState('');
  const [uploaded, setUploaded] = useState([]);

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!files?.length) {
      setMessage('Please select at least one file.');
      return;
    }

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
      setUploaded(result.files.map((f) => f.url));
      setImages(result.files.map((f) => f.url));
    } else {
      setMessage(result.error || 'Upload failed');
    }
  };

  return (
    <div className="p-6">
      <span style={{ color: "green" }}>800kb max per image</span>
      <form style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingBottom: "0.5em" }}>
      <div className="form_group">
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className="block mb-4"
        />
        </div>
        <button
          type="button"
          onClick={handleImageSubmit}
          className="techwave_fn_button"
        >
          Upload Images
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}

      {uploaded.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingBottom: "0.5em" }}>
          {uploaded.map((url, idx) => (
            <img key={idx} src={url} alt={`Uploaded ${idx}`} className="w-full" />
          ))}
        </div>
      )}
    </div>
  );
}
