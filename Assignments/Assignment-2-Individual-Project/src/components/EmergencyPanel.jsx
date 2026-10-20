import React from 'react';

export const EmergencyPanel = ({ lanes, onTriggerEmergency, onClearEmergency }) => {
  const isEmergencyActive = Object.values(lanes).some(l => l.emergencyVehicle);

  return (
    <div className="panel">
      <div className="panel-header">
        <h3 className="danger-text">🚨 Emergency Priority Corridor</h3>
        {isEmergencyActive && (
          <button className="btn-secondary mini" onClick={onClearEmergency}>
            Clear Emergency
          </button>
        )}
      </div>

      <div className="emergency-grid">
        <button
          className="btn-emergency"
          onClick={() => onTriggerEmergency('North', 'Ambulance #108')}
        >
          <span>🚑</span> North Ambulance
        </button>
        <button
          className="btn-emergency"
          onClick={() => onTriggerEmergency('West', 'Fire Engine #101')}
        >
          <span>🚒</span> West Fire Engine
        </button>
        <button
          className="btn-emergency"
          onClick={() => onTriggerEmergency('East', 'Police Interceptor')}
        >
          <span>🚓</span> East Police Unit
        </button>
        <button
          className="btn-emergency"
          onClick={() => onTriggerEmergency('South', 'Trauma Ambulance')}
        >
          <span>🚑</span> South Ambulance
        </button>
      </div>
    </div>
  );
};

export default EmergencyPanel;
