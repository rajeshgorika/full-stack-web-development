import React from 'react';

export const LaneController = ({ lanes, activeLane, mode, onUpdateDensity, onManualSwitch }) => {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Lane Density & Adaptive Timers</h3>
        <span className="sub-text">Dynamic allocation (15s to 60s)</span>
      </div>

      <div className="lane-controls-list">
        {Object.entries(lanes).map(([dir, lane]) => {
          const isGreen = lane.signal === 'Green';
          return (
            <div key={dir} className={`lane-item-card ${isGreen ? 'is-active-green' : ''}`}>
              <div className="lane-meta">
                <h4>{dir} Lane</h4>
                <p>
                  Allocated: <strong>{lane.allocatedGreen}s</strong> | Queue: {lane.queueLengthMeters}m
                </p>
              </div>

              <div className="lane-actions">
                <span className={`congestion-pill ${lane.congestion.toLowerCase()}`}>
                  {lane.congestion}
                </span>

                <span className="vehicle-counter">
                  {lane.vehicleCount} cars
                </span>

                <div className="density-buttons">
                  <button className="density-btn" onClick={() => onUpdateDensity(dir, -5)} title="Reduce 5 cars">-5</button>
                  <button className="density-btn" onClick={() => onUpdateDensity(dir, +5)} title="Add 5 cars">+5</button>
                  <button className="density-btn" onClick={() => onUpdateDensity(dir, +10)} title="Add 10 cars">+10</button>
                </div>

                {mode === 'Manual' && !isGreen && (
                  <button className="btn-primary mini" onClick={() => onManualSwitch(dir)}>
                    Make Green
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LaneController;
