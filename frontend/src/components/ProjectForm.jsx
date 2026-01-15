import React, { useState } from "react";

// Get the API URL from the environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL;

function ProjectForm({ onProjectAdded }) {
  // State to hold form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    category: "Web Development", // Using the string name as defined in seed_db.py
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Submission failed: ${JSON.stringify(errorData)}`);
      }

      const newProject = await response.json();
      setMessage(`Project "${newProject.title}" added successfully!`);

      onProjectAdded();

      setFormData({
        title: "",
        description: "",
        technologies: "",
        category: "Web Development",
      });
    } catch (err) {
      console.error("API POST Error:", err);
      setError(err.message || "An unknown error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="project-form-container">
      <h2>Add a New Project</h2>

      {error && (
        <div
          className="error-message"
          style={{ color: "red", padding: "10px", background: "#fee" }}
        >
          {error}
        </div>
      )}
      {message && (
        <div
          className="success-message"
          style={{ color: "green", padding: "10px", background: "#efe" }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="project-form">
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </label>

        <label>
          Technologies (comma-separated):
          <input
            type="text"
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            placeholder="e.g., Python, Django"
            disabled={isSubmitting}
          />
        </label>

        <label>
          Category:
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="Web Development">Web Development</option>
            <option value="Data Science">Data Science</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{ marginTop: "10px" }}
        >
          {isSubmitting ? "Submitting..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}

export default ProjectForm;
