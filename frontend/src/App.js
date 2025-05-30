import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Get the backend API base URL from environment variable, fallback to localhost for development
const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function App() {
  // State to store all resources fetched from the backend
  const [resources, setResources] = useState([]);

  // State to store the new resource being created via the form
  const [newResource, setNewResource] = useState({
    title: '',
    link: '',
    type: ''
  });

  // useEffect runs once when the component mounts
  // It fetches all resources from the backend API
  useEffect(() => {
    axios.get(`${baseUrl}/resources`)
      .then((res) => setResources(res.data))
      .catch((err) => console.error('Error fetching resources:', err));
  }, []);

  // Update form input values in state as user types
  const handleChange = (e) => {
    setNewResource({
      ...newResource,
      [e.target.name]: e.target.value,
    });
  };

  // Submit the form to add a new resource
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${baseUrl}/resources`, newResource)
      .then((res) => {
        // Add the newly created resource to the current list
        setResources([...resources, res.data]);
        // Clear form after successful submission
        setNewResource({ title: '', link: '', type: '' });
      })
      .catch((err) => console.error('Error adding resource:', err));
  };

  // Delete a resource by ID
  const handleDelete = (id) => {
    axios.delete(`${baseUrl}/resources/${id}`)
      .then(() => {
        // Filter out the deleted resource from state
        setResources(resources.filter((r) => r.id !== id));
      })
      .catch((err) => console.error('Error deleting resource:', err));
  };

  return (
    <div className="App">
      <h1>Tech Learning Tracker</h1>

      {/* Form to add new learning resource */}
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={newResource.title}
          onChange={handleChange}
          required
        />
        <input
          name="link"
          placeholder="Link"
          value={newResource.link}
          onChange={handleChange}
          required
        />
        <input
          name="type"
          placeholder="Type (e.g., article, video)"
          value={newResource.type}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Resource</button>
      </form>

      {/* Display list of learning resources */}
      <ul>
        {resources.map((res) => (
          <li key={res.id}>
            <strong>{res.title}</strong> ({res.type}) -{' '}
            <a href={res.link} target="_blank" rel="noreferrer">View</a>
            <button onClick={() => handleDelete(res.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
