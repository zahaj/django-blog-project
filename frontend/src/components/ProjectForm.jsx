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
      setMessage(`Success! Added: ${newProject.title}`);
      onProjectAdded(); // Refresh the list
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
        maxWidth: "500px",
        border: "2px solid #007bff",
        borderRadius: "8px",
        background: "#fff",
      }}
    >
      <h2 style={{ marginTop: 0, color: "#333" }}>Add a New Project</h2>

      {error && (
        <div
          style={{
            color: "#721c24",
            backgroundColor: "#f8d7da",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          {error}
        </div>
      )}

      {message && (
        <div
          style={{
            color: "#155724",
            backgroundColor: "#d4edda",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "15px",
            border: "2px solid #155724",
          }}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          name="title"
          placeholder="Project Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{ padding: "10px" }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          style={{ padding: "10px", minHeight: "80px" }}
        />
        <input
          name="technologies"
          placeholder="Technologies (e.g. React, Python)"
          value={formData.technologies}
          onChange={handleChange}
          style={{ padding: "10px" }}
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          style={{ padding: "10px" }}
        >
          <option value="Web Development">Web Development</option>
          <option value="Data Science">Data Science</option>
        </select>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "12px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {isSubmitting ? "Sending..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}

export default ProjectForm;
