import React, { useState, useEffect } from 'react';
import initialData from './data.json';
import { IntersectionVisualizer } from './components/IntersectionVisualizer';
import { LaneController } from './components/LaneController';
import { EmergencyPanel } from './components/EmergencyPanel';
import { MetricsDisplay } from './components/MetricsDisplay';
import './style.css';

// Audio tone generator for emergency alert
const playEmergencyTone = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(650, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(950, audioCtx.currentTime + 0.2);
    osc.frequency.linearRampToValueAtTime(650, audioCtx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.45);
  } catch (e) {}
};

export function App() {
  const [db, setDb] = useState(initialData);
  const [isSimulating, setIsSimulating] = useState(true);
  const [isYellowPhase, setIsYellowPhase] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);

  const junction = db.junctions[0];

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

  const advancePhase = (customLane = null) => {
    setDb(prev => {
      const j = prev.junctions[0];
      const laneKeys = ['North', 'East', 'South', 'West'];
      let nextLane = customLane;

      if (!nextLane) {
        if (j.mode === 'Adaptive') {
          const others = laneKeys.filter(l => l !== j.activeLane);
          others.sort((a, b) => j.lanes[b].vehicleCount - j.lanes[a].vehicleCount);
          nextLane = others[0] || laneKeys[0];
        } else {
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

      // Clear some departed cars from newly active lane
      const departed = Math.min(newLanes[nextLane].vehicleCount, 6);
      newLanes[nextLane].vehicleCount = Math.max(0, newLanes[nextLane].vehicleCount - departed);
      newLanes[nextLane].congestion = getCongestion(newLanes[nextLane].vehicleCount);

      const newMetrics = {
        ...j.metrics,
        totalCyclesCompleted: (j.metrics.totalCyclesCompleted || 0) + 1,
        throughputVehiclesPerMin: Math.min(95, j.metrics.throughputVehiclesPerMin + 1),
        co2SavedKg: parseFloat((j.metrics.co2SavedKg + 0.4).toFixed(1))
      };

      const updatedJunction = {
        ...j,
        activeLane: nextLane,
        timerRemaining: newLanes[nextLane].allocatedGreen,
        lanes: newLanes,
        metrics: newMetrics
      };

      const newLog = {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        event: 'Signal Phase Advance',
        detail: `Green signal awarded to ${nextLane} lane for ${updatedJunction.timerRemaining}s.`
      };

      return {
        ...prev,
        junctions: [updatedJunction],
        logs: [newLog, ...prev.logs.slice(0, 20)]
      };
    });
    setIsYellowPhase(false);
  };

  // Timer simulation loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setDb(prev => {
        const j = prev.junctions[0];
        const timer = j.timerRemaining;

        if (timer <= 4 && timer > 1 && !isYellowPhase) {
          setIsYellowPhase(true);
        }

        if (timer <= 1) {
          advancePhase();
          return prev;
        }

        const updated = {
          ...j,
          timerRemaining: j.timerRemaining - 1
        };

        return {
          ...prev,
          junctions: [updated]
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating, isYellowPhase]);

  const handleUpdateDensity = (laneKey, delta) => {
    setDb(prev => {
      const j = prev.junctions[0];
      const count = Math.max(0, j.lanes[laneKey].vehicleCount + delta);
      const congestion = getCongestion(count);
      const allocatedGreen = calculateGreenTime(count);

      const newLanes = {
        ...j.lanes,
        [laneKey]: {
          ...j.lanes[laneKey],
          vehicleCount: count,
          congestion,
          allocatedGreen,
          queueLengthMeters: Math.round(count * 5.2)
        }
      };

      return {
        ...prev,
        junctions: [{
          ...j,
          lanes: newLanes,
          timerRemaining: j.activeLane === laneKey && j.mode === 'Adaptive' ? allocatedGreen : j.timerRemaining
        }]
      };
    });
  };

  const handleTriggerEmergency = (laneKey, vehicleName) => {
    playEmergencyTone();
    setDb(prev => {
      const j = prev.junctions[0];
      const newLanes = { ...j.lanes };
      Object.keys(newLanes).forEach(l => {
        if (l === laneKey) {
          newLanes[l] = { ...newLanes[l], signal: 'Green', emergencyVehicle: true, allocatedGreen: 40 };
        } else {
          newLanes[l] = { ...newLanes[l], signal: 'Red', emergencyVehicle: false };
        }
      });

      return {
        ...prev,
        junctions: [{
          ...j,
          activeLane: laneKey,
          timerRemaining: 40,
          mode: 'Emergency Priority',
          lanes: newLanes
        }]
      };
    });
    setIsYellowPhase(false);
  };

  const handleClearEmergency = () => {
    setDb(prev => {
      const j = prev.junctions[0];
      const newLanes = { ...j.lanes };
      Object.keys(newLanes).forEach(l => {
        newLanes[l] = { ...newLanes[l], emergencyVehicle: false };
      });
      return {
        ...prev,
        junctions: [{
          ...j,
          mode: 'Adaptive',
          timerRemaining: 20,
          lanes: newLanes
        }]
      };
    });
  };

  const handleSetMode = (mode) => {
    setDb(prev => ({
      ...prev,
      junctions: [{ ...prev.junctions[0], mode }]
    }));
  };

  return (
    <div className="traffic-container">
      <header className="traffic-header">
        <div className="brand">
          <span className="brand-icon">🚦</span>
          <div>
            <h1>Smart Traffic Signal Optimisation</h1>
            <p>Adaptive Density-Weighted Scheduling (ADWS) | Assignment 2 Project</p>
          </div>
        </div>

        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setIsSimulating(!isSimulating)}>
            {isSimulating ? '⏸ Pause' : '▶ Resume'}
          </button>
          <button className="btn-primary" onClick={() => advancePhase()}>
            ⏭ Next Phase
          </button>
          <button className="btn-secondary" onClick={() => setShowJsonModal(true)}>
            💾 View JSON DB
          </button>
        </div>
      </header>

      <MetricsDisplay metrics={junction.metrics} />

      <div className="main-grid">
        <div className="col-visualizer">
          <div className="panel-title-bar">
            <h2>4-Way Crossroad Live Simulator</h2>
            <div className="mode-toggle-group">
              <button
                className={`mode-btn ${junction.mode === 'Adaptive' ? 'active' : ''}`}
                onClick={() => handleSetMode('Adaptive')}
              >
                Adaptive (AI)
              </button>
              <button
                className={`mode-btn ${junction.mode === 'Fixed' ? 'active' : ''}`}
                onClick={() => handleSetMode('Fixed')}
              >
                Fixed (25s)
              </button>
              <button
                className={`mode-btn ${junction.mode === 'Manual' ? 'active' : ''}`}
                onClick={() => handleSetMode('Manual')}
              >
                Manual
              </button>
            </div>
          </div>

          <IntersectionVisualizer junction={junction} isYellowPhase={isYellowPhase} />
        </div>

        <div className="col-controls">
          <LaneController
            lanes={junction.lanes}
            activeLane={junction.activeLane}
            mode={junction.mode}
            onUpdateDensity={handleUpdateDensity}
            onManualSwitch={advancePhase}
          />

          <EmergencyPanel
            lanes={junction.lanes}
            onTriggerEmergency={handleTriggerEmergency}
            onClearEmergency={handleClearEmergency}
          />
        </div>
      </div>

      {showJsonModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Sample Dummy Database (data.json)</h3>
              <button className="modal-close" onClick={() => setShowJsonModal(false)}>✕</button>
            </div>
            <pre className="json-box">{JSON.stringify(db, null, 2)}</pre>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => { setDb(initialData); setShowJsonModal(false); }}>
                Reset to Default
              </button>
              <button className="btn-primary" onClick={() => setShowJsonModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
