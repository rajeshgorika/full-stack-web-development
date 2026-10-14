import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Web Audio API tone generator for realistic card tap feedback
const playTone = (isSuccess) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (isSuccess) {
      // Pleasant dual chime
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      osc.frequency.setValueAtTime(1174.66, audioCtx.currentTime + 0.08); // D6
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } else {
      // Rejection buzz
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    }
  } catch (e) {
    // AudioContext blocked or unsupported, fail silently
  }
};

function App() {
  const [cards, setCards] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [newCardForm, setNewCardForm] = useState({
    holderName: '',
    rollNumber: '',
    email: '',
    department: 'Computer Science & Engineering',
    cardType: 'Student',
    initialBalance: '500'
  });

  // Fetch initial cards and ledger
  const loadData = async () => {
    try {
      const [cardsRes, txRes] = await Promise.all([
        fetch(`${API_BASE}/cards`),
        fetch(`${API_BASE}/transactions`)
      ]);
      const cardsJson = await cardsRes.json();
      const txJson = await txRes.json();

      if (cardsJson.success && cardsJson.data.length > 0) {
        setCards(cardsJson.data);
        setActiveCard(prev => {
          if (!prev) return cardsJson.data[0];
          const found = cardsJson.data.find(c => c._id === prev._id);
          return found || cardsJson.data[0];
        });
      }

      if (txJson.success) {
        setTransactions(txJson.data);
      }
    } catch (err) {
      console.warn('API error, relying on internal state', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Tap & Pay / Turnstile Gate simulation
  const handleTerminalTap = async (terminal) => {
    if (!activeCard) return;

    try {
      const res = await fetch(`${API_BASE}/cards/${activeCard._id}/tap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: terminal.cost,
          location: terminal.name,
          type: terminal.type
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playTone(true);
        setFeedback({
          type: 'success',
          message: data.message
        });
        loadData();
      } else {
        playTone(false);
        setFeedback({
          type: 'error',
          message: data.error || 'Transaction Declined'
        });
        loadData();
      }
    } catch (e) {
      playTone(false);
      setFeedback({ type: 'error', message: 'Terminal connection error' });
    }
  };

  // Handle Wallet Recharge
  const handleRecharge = async (amount) => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || !activeCard) return;

    try {
      const res = await fetch(`${API_BASE}/cards/${activeCard._id}/recharge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt, location: 'Web Portal Wallet Top-up' })
      });
      const data = await res.json();
      if (data.success) {
        playTone(true);
        setFeedback({ type: 'success', message: `Wallet topped up with ₹${amt.toFixed(2)}!` });
        setRechargeAmount('');
        loadData();
      } else {
        setFeedback({ type: 'error', message: data.error });
      }
    } catch (e) {
      setFeedback({ type: 'error', message: 'Failed to process recharge.' });
    }
  };

  // Toggle Block / Unblock card
  const handleToggleStatus = async () => {
    if (!activeCard) return;
    try {
      const res = await fetch(`${API_BASE}/cards/${activeCard._id}/status`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: data.data.status === 'Active' ? 'success' : 'error',
          message: `Smart Card is now ${data.data.status.toUpperCase()}`
        });
        loadData();
      }
    } catch (e) {
      setFeedback({ type: 'error', message: 'Failed to toggle card status' });
    }
  };

  // Issue new smart card
  const handleIssueCard = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCardForm)
      });
      const data = await res.json();
      if (data.success) {
        setShowIssueModal(false);
        setFeedback({ type: 'success', message: `Card issued for ${data.data.holderName}!` });
        loadData();
        setActiveCard(data.data);
      }
    } catch (e) {
      setFeedback({ type: 'error', message: 'Failed to issue card' });
    }
  };

  const terminals = [
    { name: 'Cafeteria POS #1', type: 'Tap & Pay', cost: 80, icon: '☕', label: 'Lunch Meal (₹80)' },
    { name: 'Central Library Turnstile', type: 'Gate Access', cost: 0, icon: '📚', label: 'Library Gate (Free)' },
    { name: 'Campus Shuttle Bus', type: 'Tap & Pay', cost: 25, icon: '🚌', label: 'Transit Bus (₹25)' },
    { name: 'Advanced Computing Lab', type: 'Gate Access', cost: 0, icon: '🧪', label: 'Lab Access (Free)' },
    { name: 'Stationery & Printing', type: 'Tap & Pay', cost: 45, icon: '🖨️', label: 'Print Service (₹45)' }
  ];

  return (
    <div className="smart-card-container">
      {/* Top Header */}
      <header className="header-bar">
        <div className="brand-title">
          <div className="brand-icon">💳</div>
          <div>
            <h1>Smart Card Identity & Digital Wallet System</h1>
            <p>MERN Full-Stack Mini Project | RFID/NFC Campus Card Simulator</p>
          </div>
        </div>

        <div className="header-actions">
          {cards.length > 0 && (
            <select
              className="card-selector"
              value={activeCard?._id || ''}
              onChange={(e) => {
                const sel = cards.find(c => c._id === e.target.value);
                if (sel) {
                  setActiveCard(sel);
                  setFeedback(null);
                }
              }}
            >
              {cards.map(c => (
                <option key={c._id} value={c._id}>
                  {c.holderName} ({c.cardNumber.slice(-4)}) - {c.status}
                </option>
              ))}
            </select>
          )}
          <button className="btn-primary" onClick={() => setShowIssueModal(true)}>
            + Issue New Card
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Left Column: Visual Card & Terminal Simulator */}
        <div>
          {/* 3D Smart Card Graphic */}
          {activeCard && (
            <div className="virtual-card-wrapper">
              <div className={`smart-card-visual ${activeCard.status === 'Active' ? 'active-card' : 'blocked-card'}`}>
                <div className="card-top-row">
                  <span className="card-logo">CAMPUS SMART CARD</span>
                  <span className={`status-pill ${activeCard.status.toLowerCase()}`}>
                    {activeCard.status}
                  </span>
                </div>

                <div className="card-chip-container">
                  <div className="emv-chip"></div>
                  <span className="nfc-wave">📶</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: 'auto' }}>
                    UID: {activeCard.cardUID}
                  </span>
                </div>

                <div className="card-number-display">
                  {activeCard.cardNumber}
                </div>

                <div className="card-bottom-row">
                  <div className="holder-info">
                    <div className="label">Cardholder</div>
                    <div className="name">{activeCard.holderName}</div>
                    <div className="roll">{activeCard.rollNumber} • {activeCard.department}</div>
                  </div>

                  <div className="card-balance-display">
                    <div className="label">Wallet Balance</div>
                    <div className="amount">₹{activeCard.balance?.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Security Controls */}
          {activeCard && (
            <div className="panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Security Protection</strong>
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {activeCard.status === 'Active' ? 'Card is fully functional.' : 'Card is locked against all transactions.'}
                </p>
              </div>
              <button
                className={activeCard.status === 'Active' ? 'btn-danger' : 'btn-primary'}
                onClick={handleToggleStatus}
              >
                {activeCard.status === 'Active' ? '🔒 Block Lost Card' : '🔓 Unblock Card'}
              </button>
            </div>
          )}

          {/* Tap POS & Turnstile Simulator */}
          <div className="panel">
            <div className="panel-header">
              <h3>📡 Tap Terminal Simulator</h3>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Simulate NFC/RFID Tap</span>
            </div>

            <div className="terminal-grid">
              {terminals.map((term, i) => (
                <div key={i} className="terminal-card" onClick={() => handleTerminalTap(term)}>
                  <div>
                    <div className="terminal-icon">{term.icon}</div>
                    <div className="terminal-title">{term.name}</div>
                  </div>
                  <div className="terminal-cost">{term.label}</div>
                </div>
              ))}
            </div>

            {feedback && (
              <div className={`feedback-banner ${feedback.type}`}>
                <span>{feedback.type === 'success' ? '✓' : '⚠️'}</span>
                <span>{feedback.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Wallet Recharge & Live Ledger */}
        <div>
          {/* Wallet Recharge Panel */}
          <div className="panel">
            <div className="panel-header">
              <h3>⚡ Digital Wallet Top-Up</h3>
              <span style={{ fontSize: '12px', color: '#38bdf8' }}>Instant UPI / Gateway</span>
            </div>

            <div className="quick-recharge-row">
              <button className="chip-btn" onClick={() => handleRecharge(100)}>+ ₹100</button>
              <button className="chip-btn" onClick={() => handleRecharge(500)}>+ ₹500</button>
              <button className="chip-btn" onClick={() => handleRecharge(1000)}>+ ₹1,000</button>
            </div>

            <form
              className="custom-recharge-row"
              onSubmit={(e) => {
                e.preventDefault();
                handleRecharge(rechargeAmount);
              }}
            >
              <input
                type="number"
                placeholder="Enter custom amount (₹)"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                min="10"
              />
              <button type="submit" className="btn-primary">Top Up</button>
            </form>
          </div>

          {/* Live Transaction Ledger */}
          <div className="panel">
            <div className="panel-header">
              <h3>📜 Real-Time Transaction Ledger</h3>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>{transactions.length} records</span>
            </div>

            <div className="tx-list">
              {transactions.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '13px' }}>No transactions recorded yet.</p>
              ) : (
                transactions.map((tx, idx) => {
                  const isCredit = tx.type === 'Recharge';
                  const isGate = tx.type === 'Gate Access';
                  return (
                    <div key={tx._id || idx} className="tx-item">
                      <div className="tx-main">
                        <div className="tx-icon">
                          {isCredit ? '📥' : isGate ? '🚪' : '💳'}
                        </div>
                        <div>
                          <div className="tx-title">{tx.location}</div>
                          <div className="tx-meta">
                            {tx.type} • {new Date(tx.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                            <span style={{ color: tx.status === 'Success' ? '#34d399' : '#f87171' }}>
                              {tx.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className={`tx-amount ${isCredit ? 'credit' : isGate ? 'neutral' : 'debit'}`}>
                        {isCredit ? `+₹${tx.amount.toFixed(2)}` : isGate ? 'Access' : `-₹${tx.amount.toFixed(2)}`}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Issue New Card */}
      {showIssueModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="panel" style={{ maxWidth: '480px', width: '90%', background: '#111827' }}>
            <div className="panel-header">
              <h3>Issue New Smart Card</h3>
              <button
                onClick={() => setShowIssueModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueCard} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newCardForm.holderName}
                  onChange={(e) => setNewCardForm({ ...newCardForm, holderName: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Roll / Employee ID</label>
                  <input
                    type="text"
                    required
                    placeholder="22CS101"
                    value={newCardForm.rollNumber}
                    onChange={(e) => setNewCardForm({ ...newCardForm, rollNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Card Type</label>
                  <select
                    value={newCardForm.cardType}
                    onChange={(e) => setNewCardForm({ ...newCardForm, cardType: e.target.value })}
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Staff">Staff</option>
                    <option value="Visitor">Visitor</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="user@college.edu"
                  value={newCardForm.email}
                  onChange={(e) => setNewCardForm({ ...newCardForm, email: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Department</label>
                <input
                  type="text"
                  placeholder="Computer Science & Engineering"
                  value={newCardForm.department}
                  onChange={(e) => setNewCardForm({ ...newCardForm, department: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Initial Balance (₹)</label>
                <input
                  type="number"
                  placeholder="500"
                  value={newCardForm.initialBalance}
                  onChange={(e) => setNewCardForm({ ...newCardForm, initialBalance: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Issue Smart Card
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowIssueModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
