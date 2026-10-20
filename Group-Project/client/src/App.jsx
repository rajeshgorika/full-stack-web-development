import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

const initialResources = [
  { id: '1', title: 'AI & GPU Compute Lab 1', category: 'High-Performance Computing', capacity: 30, status: 'Available' },
  { id: '2', title: 'Full-Stack Web Dev Studio', category: 'Software Lab', capacity: 45, status: 'Available' },
  { id: '3', title: 'Hardware IoT & Robotics Arena', category: 'Embedded Systems', capacity: 25, status: 'Booked' },
  { id: '4', title: 'Seminar Conference Hall A', category: 'Auditorium', capacity: 120, status: 'Available' }
];

export function App() {
  const [resources, setResources] = useState(initialResources);
  const [bookedCount, setBookedCount] = useState(1);

  useEffect(() => {
    fetch(`${API_BASE}/resources`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setResources(data.data);
          setBookedCount(data.data.filter(r => r.status === 'Booked').length);
        }
      })
      .catch(() => {
        // Run with local in-memory state
      });
  }, []);

  const toggleBooking = (id) => {
    setResources(prev => {
      const updated = prev.map(r => {
        if (r.id === id) {
          const nextStatus = r.status === 'Available' ? 'Booked' : 'Available';
          return { ...r, status: nextStatus };
        }
        return r;
      });
      setBookedCount(updated.filter(r => r.status === 'Booked').length);
      return updated;
    });
  };

  return (
    <div className="portal-container">
      <header className="portal-header">
        <div className="portal-brand">
          <span style={{ fontSize: '28px' }}>🏢</span>
          <div>
            <h1>Campus Resource & Lab Booking Portal</h1>
            <p>Group Project | MERN Full-Stack Collaborative Architecture</p>
          </div>
        </div>
      </header>

      <div className="stats-row">
        <div className="stat-box">
          <div className="num">{resources.length}</div>
          <div className="desc">Total Tracked Resources</div>
        </div>
        <div className="stat-box">
          <div className="num">{resources.length - bookedCount}</div>
          <div className="desc">Currently Available</div>
        </div>
        <div className="stat-box">
          <div className="num">{bookedCount}</div>
          <div className="desc">Occupied / Booked</div>
        </div>
      </div>

      <div className="panel">
        <h2>Campus Resources & Laboratories</h2>
        <div className="resource-grid">
          {resources.map(res => (
            <div key={res.id} className="resource-card">
              <div>
                <span className={`badge ${res.status.toLowerCase()}`}>{res.status}</span>
                <h3 style={{ marginTop: '10px' }}>{res.title}</h3>
                <p>{res.category} • Capacity: {res.capacity} seats</p>
              </div>
              <button
                className={`btn ${res.status === 'Available' ? 'btn-primary' : 'btn-danger'}`}
                onClick={() => toggleBooking(res.id)}
              >
                {res.status === 'Available' ? 'Book Resource' : 'Release Booking'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
