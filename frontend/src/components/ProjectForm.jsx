import React, { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function ProjectForm({ onProjectAdded }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    category: "Web Development",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (message) setMessage("");
    if (error) setError(null);
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage("");

    const techArray = formData.technologies
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    const dataToSend = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      technologies: techArray,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      const newProject = await response.json();
      setMessage(`✅ Success! Project "${newProject.title}" is now live.`);
      onProjectAdded();
      setFormData({
        title: "",
        description: "",
        technologies: "",
        category: "Web Development",
      });
    } catch (err) {
      setError(`Submission failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        margin: "20px auto",
        padding: "20px",
        maxWidth: "600px",
        border: "3px solid #007bff",
        borderRadius: "12px",
        background: "#ffffff",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginTop: 0, color: "#007bff" }}>Add a New Project</h3>

      {error && (
        <div
          style={{
            color: "#721c24",
            backgroundColor: "#f8d7da",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "15px",
            border: "1px solid #f5c6cb",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {message && (
        <div
          style={{
            color: "#155724",
            backgroundColor: "#d4edda",
            padding: "15px",
            borderRadius: "6px",
            marginBottom: "15px",
            border: "2px solid #155724",
            fontSize: "1.1rem",
            textAlign: "center",
          }}
        >
          <strong>{message}</strong>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <input
          name="title"
          placeholder="Project Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{
            padding: "12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          style={{
            padding: "12px",
            minHeight: "100px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <input
          name="technologies"
          placeholder="Technologies (e.g. React, Python, Docker)"
          value={formData.technologies}
          onChange={handleChange}
          style={{
            padding: "12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <label style={{ fontSize: "0.9rem", color: "#666" }}>Category:</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          style={{
            padding: "12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value="Web Development">Web Development</option>
          <option value="Data Science">Data Science</option>
        </select>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "14px",
            backgroundColor: isSubmitting ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
        >
          {isSubmitting ? "Submitting to Database..." : "🚀 Create Project"}
        </button>
      </form>
    </div>
  );
}

export default ProjectForm;
