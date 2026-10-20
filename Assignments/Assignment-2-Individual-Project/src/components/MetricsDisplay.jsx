import React from 'react';

export const MetricsDisplay = ({ metrics }) => {
  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <div className="metric-icon">⏱️</div>
        <div>
          <div className="metric-value">{metrics?.avgWaitTimeSec || 36}s</div>
          <div className="metric-label">Average Wait Time</div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon">🚗</div>
        <div>
          <div className="metric-value">{metrics?.throughputVehiclesPerMin || 68}/min</div>
          <div className="metric-label">Vehicle Throughput</div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon">🌱</div>
        <div>
          <div className="metric-value">{metrics?.co2SavedKg || 158.4} kg</div>
          <div className="metric-label">CO2 Saved</div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon">🔄</div>
        <div>
          <div className="metric-value">{metrics?.totalCyclesCompleted || 214}</div>
          <div className="metric-label">Adaptive Cycles Completed</div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;
