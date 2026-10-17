import React, { useState, useEffect, useRef } from 'react';
import initialTrafficDB from './data/trafficDB.json';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/traffic';

// Audio alert for emergency corridor using Web Audio API
const playEmergencyTone = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(900, audioCtx.currentTime + 0.2);
    osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.45);
  } catch (e) {}
};

function App() {
  const [db, setDb] = useState(initialTrafficDB);
  const [selectedJunctionId, setSelectedJunctionId] = useState('J-101');
  const [isSimulating, setIsSimulating] = useState(true);
  const [isYellowPhase, setIsYellowPhase] = useState(false);
  const [showJsonDbModal, setShowJsonDbModal] = useState(false);

  const currentJunction = db.junctions.find(j => j.id === selectedJunctionId) || db.junctions[0];

  // Fetch from backend API on load, fallback to initialTrafficDB
  useEffect(() => {
    fetch(`${API_BASE}/junctions`)
      .then(res => res.json())
      .then(resData => {
        if (resData.success && resData.data) {
          setDb(prev => ({ ...prev, junctions: resData.data }));
        }
      })
      .catch(() => {
        console.log('Backend offline, using client-bundled JSON DB');
      });
  }, []);

  // Adaptive timing calculation function
  const calculateGreenTime = (vehicleCount, capacity = 45) => {
    const minGreen = 15;
    const maxGreen = 60;
    const ratio = Math.min(vehicleCount / capacity, 1.2);
    return Math.round(minGreen + ratio * (maxGreen - minGreen));
  };

  const getCongestion = (vehicleCount, capacity = 45) => {
    const ratio = vehicleCount / capacity;
    if (ratio < 0.35) return 'Low';
    if (ratio < 0.70) return 'Medium';
    if (ratio < 0.95) return 'High';
    return 'Severe';
  };

  // Helper to switch phase to next lane
  const advanceToNextLane = (customLane = null) => {
    setDb(prevDb => {
      const updatedJunctions = prevDb.junctions.map(j => {
        if (j.id !== currentJunction.id) return j;

        const laneKeys = ['North', 'East', 'South', 'West'];
        let nextLane = customLane;

        if (!nextLane) {
          if (j.mode === 'Adaptive') {
            // Adaptive: pick non-active lane with highest vehicle count
            const others = laneKeys.filter(l => l !== j.activeLane);
            others.sort((a, b) => j.lanes[b].vehicleCount - j.lanes[a].vehicleCount);
            nextLane = others[0] || laneKeys[0];
          } else {
            // Fixed round-robin
            const curIdx = laneKeys.indexOf(j.activeLane);
            nextLane = laneKeys[(curIdx + 1) % laneKeys.length];
          }
        }

        const newLanes = { ...j.lanes };
        laneKeys.forEach(l => {
          if (l === nextLane) {
            newLanes[l] = {
              ...newLanes[l],
              signal: 'Green',
              allocatedGreen: j.mode === 'Fixed' ? 25 : calculateGreenTime(newLanes[l].vehicleCount)
            };
          } else {
            newLanes[l] = {
              ...newLanes[l],
              signal: 'Red',
              emergencyVehicle: false
            };
          }
        });

        // Vehicles depart from green lane
        const departed = Math.min(newLanes[nextLane].vehicleCount, 6);
        newLanes[nextLane].vehicleCount = Math.max(0, newLanes[nextLane].vehicleCount - departed);
        newLanes[nextLane].congestion = getCongestion(newLanes[nextLane].vehicleCount, newLanes[nextLane].capacity);

        const newMetrics = {
          ...j.metrics,
          totalCyclesCompleted: (j.metrics.totalCyclesCompleted || 0) + 1,
          throughputVehiclesPerMin: Math.min(95, j.metrics.throughputVehiclesPerMin + 1),
          co2SavedKg: parseFloat((j.metrics.co2SavedKg + 0.4).toFixed(1))
        };

        return {
          ...j,
          activeLane: nextLane,
          timerRemaining: newLanes[nextLane].allocatedGreen,
          lanes: newLanes,
          metrics: newMetrics
        };
      });

      const newLog = {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        junctionId: currentJunction.id,
        event: 'Signal Phase Transition',
        detail: `Green light allocated to ${currentJunction.activeLane} lane.`
      };

      return {
        ...prevDb,
        junctions: updatedJunctions,
        logs: [newLog, ...prevDb.logs.slice(0, 30)]
      };
    });
    setIsYellowPhase(false);
  };

  // Timer simulation loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setDb(prevDb => {
        const j = prevDb.junctions.find(item => item.id === selectedJunctionId);
        if (!j) return prevDb;

        const currentTimer = j.timerRemaining;

        // Enter yellow phase during last 3 seconds
        if (currentTimer <= 4 && currentTimer > 1 && !isYellowPhase) {
          setIsYellowPhase(true);
        }

        if (currentTimer <= 1) {
          // Timer expired, advance to next phase
          advanceToNextLane();
          return prevDb;
        }

        // Decrement timer
        const updatedJunctions = prevDb.junctions.map(item => {
          if (item.id === selectedJunctionId) {
            return {
              ...item,
              timerRemaining: item.timerRemaining - 1
            };
          }
          return item;
        });

        return {
          ...prevDb,
          junctions: updatedJunctions
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating, selectedJunctionId, isYellowPhase]);

  // Adjust vehicle count on a lane
  const handleUpdateDensity = (laneKey, delta) => {
    setDb(prevDb => {
      const updatedJunctions = prevDb.junctions.map(j => {
        if (j.id !== currentJunction.id) return j;
        const currentCount = j.lanes[laneKey].vehicleCount;
        const newCount = Math.max(0, currentCount + delta);
        const newCongestion = getCongestion(newCount, j.lanes[laneKey].capacity);
        const newGreen = calculateGreenTime(newCount, j.lanes[laneKey].capacity);

        const newLanes = {
          ...j.lanes,
          [laneKey]: {
            ...j.lanes[laneKey],
            vehicleCount: newCount,
            congestion: newCongestion,
            allocatedGreen: newGreen,
            queueLengthMeters: Math.round(newCount * 5.2)
          }
        };

        return {
          ...j,
          lanes: newLanes,
          timerRemaining: j.activeLane === laneKey && j.mode === 'Adaptive' ? newGreen : j.timerRemaining
        };
      });

      const newLog = {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        junctionId: currentJunction.id,
        event: 'Density Injected',
        detail: `${laneKey} Lane vehicle count updated to ${Math.max(0, currentJunction.lanes[laneKey].vehicleCount + delta)}.`
      };

      return {
        ...prevDb,
        junctions: updatedJunctions,
        logs: [newLog, ...prevDb.logs.slice(0, 30)]
      };
    });
  };

  // Trigger Emergency Priority Corridor
  const handleEmergencyPriority = (laneKey, vehicleName) => {
    playEmergencyTone();
    setDb(prevDb => {
      const updatedJunctions = prevDb.junctions.map(j => {
        if (j.id !== currentJunction.id) return j;

        const newLanes = { ...j.lanes };
        Object.keys(newLanes).forEach(l => {
          if (l === laneKey) {
            newLanes[l] = { ...newLanes[l], signal: 'Green', emergencyVehicle: true, allocatedGreen: 40 };
          } else {
            newLanes[l] = { ...newLanes[l], signal: 'Red', emergencyVehicle: false };
          }
        });

        return {
          ...j,
          activeLane: laneKey,
          timerRemaining: 40,
          mode: 'Emergency Priority',
          lanes: newLanes
        };
      });

      const newLog = {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        junctionId: currentJunction.id,
        event: 'EMERGENCY CORRIDOR ACTIVATED',
        detail: `Priority green granted to ${laneKey} lane for ${vehicleName}! Conflicting signals locked on Red.`
      };

      return {
        ...prevDb,
        junctions: updatedJunctions,
        logs: [newLog, ...prevDb.logs.slice(0, 30)]
      };
    });
    setIsYellowPhase(false);
  };

  // Clear Emergency Corridor
  const handleClearEmergency = () => {
    setDb(prevDb => {
      const updatedJunctions = prevDb.junctions.map(j => {
        if (j.id !== currentJunction.id) return j;
        const newLanes = { ...j.lanes };
        Object.keys(newLanes).forEach(l => {
          newLanes[l] = { ...newLanes[l], emergencyVehicle: false };
        });
        return {
          ...j,
          mode: 'Adaptive',
          timerRemaining: 20
        };
      });

      return {
        ...prevDb,
        junctions: updatedJunctions
      };
    });
  };

  // Change Operating Mode
  const handleSetMode = (mode) => {
    setDb(prevDb => {
      const updatedJunctions = prevDb.junctions.map(j => {
        if (j.id !== currentJunction.id) return j;
        return { ...j, mode };
      });
      return { ...prevDb, junctions: updatedJunctions };
    });
  };

  const isEmergencyActive = Object.values(currentJunction.lanes).some(l => l.emergencyVehicle);

  return (
    <div className="traffic-app-container">
      {/* Header */}
      <header className="traffic-header">
        <div className="header-brand">
          <div className="brand-badge">🚦</div>
          <div>
            <h1>Smart Traffic Signal Optimisation</h1>
            <p>Adaptive Density-Weighted Scheduling (ADWS) | React.js + JSON DB</p>
          </div>
        </div>

        <div className="header-controls">
          <select
            className="junction-select"
            value={selectedJunctionId}
            onChange={(e) => setSelectedJunctionId(e.target.value)}
          >
            {db.junctions.map(j => (
              <option key={j.id} value={j.id}>{j.name} ({j.id})</option>
            ))}
          </select>

          <button
            className="btn-secondary"
            onClick={() => setIsSimulating(!isSimulating)}
          >
            {isSimulating ? '⏸ Pause Sim' : '▶ Resume Sim'}
          </button>

          <button
            className="btn-primary"
            onClick={() => advanceToNextLane()}
          >
            ⏭ Advance Phase
          </button>

          <button
            className="btn-secondary"
            onClick={() => setShowJsonDbModal(true)}
          >
            💾 View JSON DB
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">⏱️</div>
          <div>
            <div className="metric-value">{currentJunction.metrics?.avgWaitTimeSec || 38}s</div>
            <div className="metric-label">Avg Wait Time</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🚗</div>
          <div>
            <div className="metric-value">{currentJunction.metrics?.throughputVehiclesPerMin || 64}/min</div>
            <div className="metric-label">Vehicle Throughput</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🌱</div>
          <div>
            <div className="metric-value">{currentJunction.metrics?.co2SavedKg || 142.8} kg</div>
            <div className="metric-label">CO2 Emissions Saved</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🔄</div>
          <div>
            <div className="metric-value">{currentJunction.metrics?.totalCyclesCompleted || 184}</div>
            <div className="metric-label">Adaptive Cycles Completed</div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Dashboard */}
      <div className="main-layout">
        {/* Left Column: 4-Way Intersection Visualizer */}
        <div className="panel">
          <div className="panel-title-bar">
            <h2>4-Way Crossroad Live Visualizer</h2>
            <div className="mode-toggle-group">
              <button
                className={`mode-btn ${currentJunction.mode === 'Adaptive' ? 'active' : ''}`}
                onClick={() => handleSetMode('Adaptive')}
              >
                Adaptive (AI)
              </button>
              <button
                className={`mode-btn ${currentJunction.mode === 'Fixed' ? 'active' : ''}`}
                onClick={() => handleSetMode('Fixed')}
              >
                Fixed (25s)
              </button>
              <button
                className={`mode-btn ${currentJunction.mode === 'Manual' ? 'active' : ''}`}
                onClick={() => handleSetMode('Manual')}
              >
                Manual
              </button>
            </div>
          </div>

          <div className="intersection-wrapper">
            {isEmergencyActive && (
              <div className="emergency-indicator">
                🚨 EMERGENCY CORRIDOR ACTIVE 🚨
              </div>
            )}

            <div className="intersection-canvas">
              {/* Road Markings */}
              <div className="road-vertical"></div>
              <div className="road-horizontal"></div>

              {/* Center Box */}
              <div className="intersection-center">
                <div className="center-radar">
                  <div>RADAR</div>
                  <div style={{ fontSize: '16px' }}>📡</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>{currentJunction.mode}</div>
                </div>
              </div>

              {/* North Lane */}
              <div className="lane-zone north">
                <div className="signal-lamp-box">
                  <span className={`light-circle red ${currentJunction.lanes.North.signal === 'Red' && !isYellowPhase ? 'active' : ''}`}></span>
                  <span className={`light-circle yellow ${isYellowPhase && currentJunction.activeLane === 'North' ? 'active' : ''}`}></span>
                  <span className={`light-circle green ${currentJunction.lanes.North.signal === 'Green' && !isYellowPhase ? 'active' : ''}`}></span>
                  <span className={`signal-timer-badge ${currentJunction.lanes.North.signal === 'Green' ? (isYellowPhase ? 'yellow' : 'green') : 'red'}`}>
                    {currentJunction.activeLane === 'North' ? `${currentJunction.timerRemaining}s` : '--'}
                  </span>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#e2e8f0' }}>NORTH</div>
                <div className="vehicles-queue-preview">
                  {currentJunction.lanes.North.emergencyVehicle && <span>🚑</span>}
                  {Array.from({ length: Math.min(8, Math.ceil(currentJunction.lanes.North.vehicleCount / 4)) }).map((_, i) => (
                    <span key={i}>🚗</span>
                  ))}
                </div>
              </div>

              {/* South Lane */}
              <div className="lane-zone south">
                <div className="vehicles-queue-preview">
                  {currentJunction.lanes.South.emergencyVehicle && <span>🚑</span>}
                  {Array.from({ length: Math.min(8, Math.ceil(currentJunction.lanes.South.vehicleCount / 4)) }).map((_, i) => (
                    <span key={i}>🚙</span>
                  ))}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#e2e8f0', marginTop: '2px' }}>SOUTH</div>
                <div className="signal-lamp-box">
                  <span className={`light-circle red ${currentJunction.lanes.South.signal === 'Red' && !isYellowPhase ? 'active' : ''}`}></span>
                  <span className={`light-circle yellow ${isYellowPhase && currentJunction.activeLane === 'South' ? 'active' : ''}`}></span>
                  <span className={`light-circle green ${currentJunction.lanes.South.signal === 'Green' && !isYellowPhase ? 'active' : ''}`}></span>
                  <span className={`signal-timer-badge ${currentJunction.lanes.South.signal === 'Green' ? (isYellowPhase ? 'yellow' : 'green') : 'red'}`}>
                    {currentJunction.activeLane === 'South' ? `${currentJunction.timerRemaining}s` : '--'}
                  </span>
                </div>
              </div>

              {/* West Lane */}
              <div className="lane-zone west">
                <div className="signal-lamp-box">
                  <span className={`light-circle red ${currentJunction.lanes.West.signal === 'Red' && !isYellowPhase ? 'active' : ''}`}></span>
                  <span className={`light-circle yellow ${isYellowPhase && currentJunction.activeLane === 'West' ? 'active' : ''}`}></span>
                  <span className={`light-circle green ${currentJunction.lanes.West.signal === 'Green' && !isYellowPhase ? 'active' : ''}`}></span>
                  <span className={`signal-timer-badge ${currentJunction.lanes.West.signal === 'Green' ? (isYellowPhase ? 'yellow' : 'green') : 'red'}`}>
                    {currentJunction.activeLane === 'West' ? `${currentJunction.timerRemaining}s` : '--'}
                  </span>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#e2e8f0' }}>WEST</div>
                <div className="vehicles-queue-preview">
                  {currentJunction.lanes.West.emergencyVehicle && <span>🚒</span>}
                  {Array.from({ length: Math.min(8, Math.ceil(currentJunction.lanes.West.vehicleCount / 4)) }).map((_, i) => (
                    <span key={i}>🚌</span>
                  ))}
                </div>
              </div>

              {/* East Lane */}
              <div className="lane-zone east">
                <div className="signal-lamp-box">
                  <span className={`light-circle red ${currentJunction.lanes.East.signal === 'Red' && !isYellowPhase ? 'active' : ''}`}></span>
                  <span className={`light-circle yellow ${isYellowPhase && currentJunction.activeLane === 'East' ? 'active' : ''}`}></span>
                  <span className={`light-circle green ${currentJunction.lanes.East.signal === 'Green' && !isYellowPhase ? 'active' : ''}`}></span>
                  <span className={`signal-timer-badge ${currentJunction.lanes.East.signal === 'Green' ? (isYellowPhase ? 'yellow' : 'green') : 'red'}`}>
                    {currentJunction.activeLane === 'East' ? `${currentJunction.timerRemaining}s` : '--'}
                  </span>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#e2e8f0' }}>EAST</div>
                <div className="vehicles-queue-preview">
                  {currentJunction.lanes.East.emergencyVehicle && <span>🚑</span>}
                  {Array.from({ length: Math.min(8, Math.ceil(currentJunction.lanes.East.vehicleCount / 4)) }).map((_, i) => (
                    <span key={i}>🚗</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Lane Density Controls & Emergency Override */}
        <div>
          {/* Lane Density & Timings */}
          <div className="panel">
            <div className="panel-header" style={{ marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px' }}>Lane Density & Adaptive Timers</h3>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Formula: 15s - 60s dynamically</span>
            </div>

            <div className="lane-controls-list">
              {Object.entries(currentJunction.lanes).map(([dir, lane]) => {
                const isGreen = lane.signal === 'Green';
                return (
                  <div key={dir} className={`lane-item-card ${isGreen ? 'is-active-green' : ''}`}>
                    <div className="lane-meta">
                      <h4>{dir} ({lane.streetName})</h4>
                      <p>
                        Allocated: <strong>{lane.allocatedGreen}s</strong> | Queue: {lane.queueLengthMeters}m
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`congestion-pill ${lane.congestion.toLowerCase()}`}>
                        {lane.congestion}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: 700, minWidth: '34px', textAlign: 'right' }}>
                        {lane.vehicleCount}
                      </span>

                      <div className="density-slider-row">
                        <button className="density-btn" onClick={() => handleUpdateDensity(dir, -5)}>-5</button>
                        <button className="density-btn" onClick={() => handleUpdateDensity(dir, +5)}>+5</button>
                        <button className="density-btn" onClick={() => handleUpdateDensity(dir, +10)}>+10</button>
                      </div>

                      {currentJunction.mode === 'Manual' && !isGreen && (
                        <button
                          className="btn-primary"
                          style={{ padding: '4px 10px', fontSize: '11px' }}
                          onClick={() => advanceToNextLane(dir)}
                        >
                          Make Green
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Emergency Corridor Override */}
          <div className="panel">
            <div className="panel-header" style={{ marginBottom: '12px' }}>
              <h3 style={{ fontSize: '15px', color: '#f87171' }}>🚨 Emergency Vehicle Priority Override</h3>
              {isEmergencyActive && (
                <button
                  className="btn-secondary"
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                  onClick={handleClearEmergency}
                >
                  Clear Emergency
                </button>
              )}
            </div>

            <div className="emergency-grid">
              <button
                className="btn-emergency"
                onClick={() => handleEmergencyPriority('North', 'Ambulance #108')}
              >
                <span>🚑</span> North Ambulance
              </button>
              <button
                className="btn-emergency"
                onClick={() => handleEmergencyPriority('West', 'Fire Engine #101')}
              >
                <span>🚒</span> West Fire Engine
              </button>
              <button
                className="btn-emergency"
                onClick={() => handleEmergencyPriority('East', 'Police Interceptor')}
              >
                <span>🚓</span> East Police Unit
              </button>
              <button
                className="btn-emergency"
                onClick={() => handleEmergencyPriority('South', 'Emergency Ambulance')}
              >
                <span>🚑</span> South Ambulance
              </button>
            </div>
          </div>

          {/* Live System Logs */}
          <div className="panel">
            <div className="panel-header" style={{ marginBottom: '10px' }}>
              <h3 style={{ fontSize: '15px' }}>📜 Real-Time Audit Logs</h3>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>{db.logs.length} entries</span>
            </div>

            <div className="logs-list">
              {db.logs.slice(0, 6).map(log => {
                const isEmerg = log.event.includes('EMERGENCY');
                return (
                  <div key={log.id} className={`log-item ${isEmerg ? 'emergency' : ''}`}>
                    <div className="log-header">
                      <span className="log-event">{log.event}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="log-detail">{log.detail}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: View Dummy JSON Database */}
      {showJsonDbModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="panel" style={{ maxWidth: '650px', width: '92%', background: '#111a2e', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className="panel-title-bar">
              <h2>Sample Dummy Database (JSON)</h2>
              <button
                onClick={() => setShowJsonDbModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>
              This is the live JSON state representing `trafficDB.json` containing intersections, sensor queue metrics, and logs:
            </p>
            <div className="json-viewer">
              {JSON.stringify(db, null, 2)}
            </div>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                className="btn-secondary"
                onClick={() => {
                  setDb(initialTrafficDB);
                  setShowJsonDbModal(false);
                }}
              >
                Reset to Default JSON
              </button>
              <button
                className="btn-primary"
                onClick={() => setShowJsonDbModal(false)}
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
