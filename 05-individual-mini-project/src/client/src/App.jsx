import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/tasks`);
      const json = await res.json();
      if (json.success) setTasks(json.data);
    } catch (err) {
      console.warn('API offline or unreachable, using local mock data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, priority })
      });
      const data = await res.json();
      if (data.success) {
        setTitle('');
        fetchTasks();
      }
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleToggle = async (id) => {
    try {
      await fetch(`${API_BASE}/tasks/${id}/toggle`, { method: 'PUT' });
      fetchTasks();
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  return (
    <div className="mini-project-app">
      <header className="header">
        <h1>Full-Stack Mini Project</h1>
        <p>Production-Grade MERN Architecture with Cloud Deployment Configs</p>
      </header>

      <div className="card">
        <form onSubmit={handleCreate} className="form-grid">
          <input
            type="text"
            placeholder="Add task or feature requirement..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Database">Database</option>
            <option value="DevOps">DevOps</option>
            <option value="General">General</option>
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button type="submit" className="btn-primary">Add Task</button>
        </form>
      </div>

      <div className="card">
        <div className="status-bar" style={{ marginBottom: '16px' }}>
          <strong>Sprint Backlog</strong>
          <span>{loading ? 'Refreshing...' : `${tasks.length} items`}</span>
        </div>

        <ul className="task-list">
          {tasks.map(task => (
            <li key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-details">
                <h3>{task.title}</h3>
                <div className="task-badges">
                  <span className="badge cat">{task.category}</span>
                  <span className={`badge priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              <div className="actions">
                <button
                  onClick={() => handleToggle(task._id)}
                  className="btn-icon check"
                  title="Toggle Completion"
                >
                  {task.completed ? '↩ Undo' : '✓ Done'}
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="btn-icon delete"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
