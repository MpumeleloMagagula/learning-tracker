import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function App() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({ title: '', url: '', type: '', category: '', status: 'Not Started' });

  useEffect(() => {
    axios.get(\`\${baseUrl}/resources\`).then((res) => setResources(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(\`\${baseUrl}/resources\`, form);
    setResources([...resources, res.data]);
    setForm({ title: '', url: '', type: '', category: '', status: 'Not Started' });
  };

  const handleDelete = async (id) => {
    await axios.delete(\`\${baseUrl}/resources/\${id}\`);
    setResources(resources.filter(r => r.id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Tech Learning Tracker</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
        <input name="url" value={form.url} onChange={handleChange} placeholder="URL" />
        <input name="type" value={form.type} onChange={handleChange} placeholder="Type (e.g., Article, Course)" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category (e.g., DevOps)" />
        <select name="status" value={form.status} onChange={handleChange}>
          <option>Not Started</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <button type="submit">Add Resource</button>
      </form>
      <ul>
        {resources.map((r) => (
          <li key={r.id}>
            <strong>{r.title}</strong> - {r.status}
            {r.url && (<a href={r.url} target="_blank" rel="noreferrer"> (link)</a>)}
            <button onClick={() => handleDelete(r.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
