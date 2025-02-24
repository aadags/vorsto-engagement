import React, { useState, useEffect } from "react";
import axios from "axios";

const DynamicForm = ({ formId }) => {
  const [title, setTitle] = useState();
  const [name, setName] = useState();
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await axios.get(`/api/public/form?formId=${formId}`);
      setTitle(response.data.form.name);
      setName(response.data.form.organization.name);
      const data = JSON.parse(response.data.form.data);
      setQuestions(data.questions);
    };
    fetchQuestions();
  }, []);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/public/form?formId=${formId}`, {
        form: JSON.stringify(formData),
      });
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        color: "#27272a",
        fontFamily: "'Inter', sans-serif",
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "2rem",
          borderRadius: "0.75rem",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "28rem",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "1.5rem",
            fontWeight: "700",
            marginBottom: "1rem",
          }}
        >
          {name} - {title}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
          {questions.map((q) => (
            <div key={q.id} style={{ display: "grid", gap: "0.5rem" }}>
              <label style={{ fontSize: "1rem", fontWeight: "500" }}>{q.question}</label>
              {["text", "email", "number"].includes(q.answerType) && (
                <input
                  type={q.answerType}
                  name={q.question}
                  style={{
                    width: "95%",
                    padding: "0.75rem",
                    backgroundColor: "#f3f4f6",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "border 0.2s ease-in-out",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#6b7280")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  onChange={(e) => handleChange(q.question, e.target.value)}
                />
              )}
              {["textarea"].includes(q.answerType) && (
                <textarea
                  name={q.question}
                  style={{
                    width: "95%",
                    padding: "0.75rem",
                    backgroundColor: "#f3f4f6",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "border 0.2s ease-in-out",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#6b7280")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  onChange={(e) => handleChange(q.question, e.target.value)}
                />
              )}
              {q.answerType === "radio" && (
                <div style={{ display: "grid", gap: "0.25rem" }}>
                  {q.options.map((option) => (
                    <label key={option} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="radio"
                        name={q.question}
                        value={option}
                        style={{ accentColor: "#6b7280", cursor: "pointer" }}
                        onChange={() => handleChange(q.question, option)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
              {q.answerType === "checkbox" && (
                <div style={{ display: "grid", gap: "0.25rem" }}>
                  {q.options.map((option) => (
                    <label key={option} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="checkbox"
                        style={{ accentColor: "#6b7280", cursor: "pointer" }}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...(formData[q.question] || []), option]
                            : (formData[q.question] || []).filter((v) => v !== option);
                          handleChange(q.question, newValue);
                        }}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#4b5563",
              borderRadius: "0.5rem",
              fontWeight: "600",
              fontSize: "1rem",
              textAlign: "center",
              color: "#ffffff",
              transition: "background 0.2s ease-in-out",
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#374151")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4b5563")}
          >
            Submit
          </button>
        </form>
        <div
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.875rem",
            color: "#6b7280",
            fontWeight: "500",
          }}
        >
          Powered by <span style={{ fontWeight: "700", color: "#4b5563" }}>Vorsto.AI</span>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;
