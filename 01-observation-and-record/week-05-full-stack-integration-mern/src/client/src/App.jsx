import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api/items';

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setItems(data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (data.success) {
        setName('');
        fetchItems();
      }
    } catch (err) {
      setError('Error adding item.');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>MERN Stack Integration Demo</h1>
        <p>Connecting React Client with Express & MongoDB Backend</p>
      </header>

      <main className="app-main">
        <form onSubmit={handleAddItem} className="item-form">
          <input
            type="text"
            placeholder="Add new fullstack item..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">Submit Item</button>
        </form>

        {error && <div className="alert error">{error}</div>}
        {loading && <p>Loading items from backend API...</p>}

        <ul className="item-list">
          {items.map((item, idx) => (
            <li key={item.id || idx}>
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
