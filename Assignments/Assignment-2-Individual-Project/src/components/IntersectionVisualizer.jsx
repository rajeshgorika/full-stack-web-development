import React from 'react';

export const IntersectionVisualizer = ({ junction, isYellowPhase }) => {
  const { lanes, activeLane, timerRemaining } = junction;

  const renderLamp = (dir) => {
    const lane = lanes[dir];
    const isGreen = lane.signal === 'Green';
    const isYellow = isYellowPhase && activeLane === dir;
    const isRed = !isGreen && !isYellow;

    return (
      <div className="signal-lamp-box">
        <span className={`light-circle red ${isRed ? 'active' : ''}`}></span>
        <span className={`light-circle yellow ${isYellow ? 'active' : ''}`}></span>
        <span className={`light-circle green ${isGreen && !isYellow ? 'active' : ''}`}></span>
        <span className={`signal-timer-badge ${isGreen ? (isYellow ? 'yellow' : 'green') : 'red'}`}>
          {activeLane === dir ? `${timerRemaining}s` : '--'}
        </span>
      </div>
    );
  };

  const renderVehicles = (lane, defaultIcon = '🚗') => {
    const count = Math.min(8, Math.ceil(lane.vehicleCount / 4));
    return (
      <div className="vehicles-queue-preview">
        {lane.emergencyVehicle && <span className="emergency-vehicle-icon">🚑</span>}
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} className="car-icon">{defaultIcon}</span>
        ))}
      </div>
    );
  };

  const isEmergencyActive = Object.values(lanes).some(l => l.emergencyVehicle);

  return (
    <div className="intersection-wrapper">
      {isEmergencyActive && (
        <div className="emergency-indicator">
          🚨 EMERGENCY GREEN CORRIDOR ACTIVE 🚨
        </div>
      )}

      <div className="intersection-canvas">
        {/* Road Markings */}
        <div className="road-vertical"></div>
        <div className="road-horizontal"></div>

        {/* Center Radar */}
        <div className="intersection-center">
          <div className="center-radar">
            <div>RADAR</div>
            <div style={{ fontSize: '18px' }}>📡</div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>{junction.mode}</div>
          </div>
        </div>

        {/* North Lane */}
        <div className="lane-zone north">
          {renderLamp('North')}
          <div className="lane-label">NORTH ({lanes.North.streetName})</div>
          {renderVehicles(lanes.North, '🚗')}
        </div>

        {/* South Lane */}
        <div className="lane-zone south">
          {renderVehicles(lanes.South, '🚙')}
          <div className="lane-label">SOUTH ({lanes.South.streetName})</div>
          {renderLamp('South')}
        </div>

        {/* West Lane */}
        <div className="lane-zone west">
          {renderLamp('West')}
          <div className="lane-label">WEST ({lanes.West.streetName})</div>
          {renderVehicles(lanes.West, '🚌')}
        </div>

        {/* East Lane */}
        <div className="lane-zone east">
          {renderLamp('East')}
          <div className="lane-label">EAST ({lanes.East.streetName})</div>
          {renderVehicles(lanes.East, '🚗')}
        </div>
      </div>
    </div>
  );
};

export default IntersectionVisualizer;
