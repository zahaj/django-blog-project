import React, { useState } from 'react';

// Get the API URL from the environment variables (same as useProjects.js)
const API_BASE_URL = import.meta.env.VITE_API_URL;

function ProjectForm({ onProjectAdded }) {
  // State to hold form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '', // Comma-separated string for simplicity
    category: 1, // Defaulting to the first category ID for simplicity
    image: '', // Optional image URL
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // Universal handler for all inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage('');

    // Prepare data
    // Note: In a production app, we would parse 'technologies' string into a list here.
    // For now, we send it as part of the object. 
    const dataToSend = {
      ...formData,
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        // Get the error details from the backend
        const errorData = await response.json();
        throw new Error(`Submission failed: ${JSON.stringify(errorData)}`);
      }

      // Success!
      const newProject = await response.json();
      setMessage(`Project "${newProject.title}" added successfully!`);
      
      // Notify the parent (App.jsx) to refresh the list
      onProjectAdded();

      // Clear the form
      setFormData({
        title: '',
        description: '',
        technologies: '',
        category: 1,
        image: '',
      });

    } catch (err) {
      console.error('API POST Error:', err);
      setError(err.message || 'An unknown error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="project-form-container">
      <h2>Add a New Project</h2>
      
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

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
            placeholder="e.g., Python, Django, React, CSS"
            disabled={isSubmitting}
          />
        </label>

        {/* Category ID: We assume ID 1 exists. In a real app, this would be a dropdown */}
        <input type="hidden" name="category" value={formData.category} />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}

export default ProjectForm;