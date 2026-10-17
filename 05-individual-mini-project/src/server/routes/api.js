const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/trafficDB.json');

// Helper to read JSON DB
const readDB = () => {
    try {
        const raw = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(raw);
    } catch (err) {
        console.error('Error reading trafficDB.json:', err);
        return { junctions: [], logs: [] };
    }
};

// Helper to write JSON DB
const writeDB = (data) => {
    try {
        data.system = data.system || {};
        data.system.lastUpdated = new Date().toISOString();
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing trafficDB.json:', err);
    }
};

// Optimization algorithm: Calculate optimal green light duration based on vehicle count
const calculateOptimalGreen = (vehicleCount, capacity = 45) => {
    const minGreen = 15;
    const maxGreen = 60;
    const densityRatio = Math.min(vehicleCount / capacity, 1.2);
    const allocated = Math.round(minGreen + densityRatio * (maxGreen - minGreen));
    return Math.max(minGreen, Math.min(maxGreen, allocated));
};

const getCongestionLevel = (vehicleCount, capacity = 45) => {
    const ratio = vehicleCount / capacity;
    if (ratio < 0.35) return 'Low';
    if (ratio < 0.70) return 'Medium';
    if (ratio < 0.95) return 'High';
    return 'Severe';
};

// 1. GET /api/traffic/junctions - All junctions
router.get('/junctions', (req, res) => {
    const db = readDB();
    res.json({
        success: true,
        count: db.junctions.length,
        system: db.system,
        data: db.junctions
    });
});

// 2. GET /api/traffic/junctions/:id - Single junction
router.get('/junctions/:id', (req, res) => {
    const db = readDB();
    const junction = db.junctions.find(j => j.id === req.params.id);
    if (!junction) {
        return res.status(404).json({ success: false, error: 'Junction not found' });
    }
    res.json({ success: true, data: junction });
});

// 3. PUT /api/traffic/junctions/:id/density - Update lane vehicle count & optimize timing
router.put('/junctions/:id/density', (req, res) => {
    const { lane, count } = req.body;
    const vehicleCount = parseInt(count, 10);

    if (!lane || isNaN(vehicleCount) || vehicleCount < 0) {
        return res.status(400).json({ success: false, error: 'Please specify lane and valid vehicle count >= 0' });
    }

    const db = readDB();
    const junction = db.junctions.find(j => j.id === req.params.id);
    if (!junction || !junction.lanes[lane]) {
        return res.status(404).json({ success: false, error: 'Junction or lane not found' });
    }

    const targetLane = junction.lanes[lane];
    targetLane.vehicleCount = vehicleCount;
    targetLane.congestion = getCongestionLevel(vehicleCount, targetLane.capacity);
    targetLane.allocatedGreen = calculateOptimalGreen(vehicleCount, targetLane.capacity);
    targetLane.queueLengthMeters = Math.round(vehicleCount * 5.2);

    // If current lane is active, update remaining timer if in adaptive mode
    if (junction.activeLane === lane && junction.mode === 'Adaptive') {
        junction.timerRemaining = targetLane.allocatedGreen;
    }

    const logEntry = {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        junctionId: junction.id,
        event: 'Density Update & Optimization',
        detail: `${lane} lane density set to ${vehicleCount} vehicles. Re-allocated green timing: ${targetLane.allocatedGreen}s (${targetLane.congestion} congestion).`
    };
    db.logs.unshift(logEntry);
    if (db.logs.length > 50) db.logs.pop();

    writeDB(db);
    res.json({ success: true, message: 'Lane density and timings optimized', data: junction, log: logEntry });
});

// 4. POST /api/traffic/junctions/:id/emergency - Trigger Emergency Vehicle Green Corridor
router.post('/junctions/:id/emergency', (req, res) => {
    const { lane, vehicleType } = req.body; // e.g. lane: 'North', vehicleType: 'Ambulance'
    if (!lane) {
        return res.status(400).json({ success: false, error: 'Emergency lane required' });
    }

    const db = readDB();
    const junction = db.junctions.find(j => j.id === req.params.id);
    if (!junction || !junction.lanes[lane]) {
        return res.status(404).json({ success: false, error: 'Junction or lane not found' });
    }

    // Turn emergency corridor on for target lane
    Object.keys(junction.lanes).forEach(l => {
        if (l === lane) {
            junction.lanes[l].signal = 'Green';
            junction.lanes[l].emergencyVehicle = true;
            junction.lanes[l].allocatedGreen = 45;
        } else {
            junction.lanes[l].signal = 'Red';
            junction.lanes[l].emergencyVehicle = false;
        }
    });

    junction.activeLane = lane;
    junction.timerRemaining = 45;
    junction.mode = 'Emergency Priority';

    const logEntry = {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        junctionId: junction.id,
        event: 'EMERGENCY CORRIDOR ACTIVATED',
        detail: `Priority green signal granted to ${lane} lane for approaching ${vehicleType || 'Emergency Vehicle'}. Conflicting lanes locked to RED.`
    };
    db.logs.unshift(logEntry);
    if (db.logs.length > 50) db.logs.pop();

    writeDB(db);
    res.json({
        success: true,
        message: `Emergency green corridor granted to ${lane} lane!`,
        data: junction,
        log: logEntry
    });
});

// 5. PUT /api/traffic/junctions/:id/mode - Toggle mode
router.put('/junctions/:id/mode', (req, res) => {
    const { mode } = req.body;
    const allowed = ['Adaptive', 'Fixed', 'Manual'];
    if (!allowed.includes(mode)) {
        return res.status(400).json({ success: false, error: 'Invalid mode. Choose Adaptive, Fixed, or Manual' });
    }

    const db = readDB();
    const junction = db.junctions.find(j => j.id === req.params.id);
    if (!junction) return res.status(404).json({ success: false, error: 'Junction not found' });

    junction.mode = mode;
    // Clear emergency flags when switching modes
    Object.keys(junction.lanes).forEach(l => {
        junction.lanes[l].emergencyVehicle = false;
    });

    const logEntry = {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        junctionId: junction.id,
        event: 'Operating Mode Changed',
        detail: `Control mode set to ${mode}.`
    };
    db.logs.unshift(logEntry);
    writeDB(db);

    res.json({ success: true, message: `Operating mode updated to ${mode}`, data: junction });
});

// 6. POST /api/traffic/junctions/:id/next-phase - Advance cycle to next prioritized lane
router.post('/junctions/:id/next-phase', (req, res) => {
    const db = readDB();
    const junction = db.junctions.find(j => j.id === req.params.id);
    if (!junction) return res.status(404).json({ success: false, error: 'Junction not found' });

    const laneKeys = ['North', 'East', 'South', 'West'];
    let nextLane = 'North';

    if (junction.mode === 'Adaptive') {
        // Pick lane with highest vehicle count that is not currently active
        const candidates = laneKeys.filter(l => l !== junction.activeLane);
        candidates.sort((a, b) => junction.lanes[b].vehicleCount - junction.lanes[a].vehicleCount);
        nextLane = candidates[0] || laneKeys[0];
    } else {
        // Round robin
        const curIdx = laneKeys.indexOf(junction.activeLane);
        nextLane = laneKeys[(curIdx + 1) % laneKeys.length];
    }

    laneKeys.forEach(l => {
        if (l === nextLane) {
            junction.lanes[l].signal = 'Green';
            junction.lanes[l].allocatedGreen = junction.mode === 'Fixed' ? 25 : calculateOptimalGreen(junction.lanes[l].vehicleCount);
        } else {
            junction.lanes[l].signal = 'Red';
            junction.lanes[l].emergencyVehicle = false;
        }
    });

    junction.activeLane = nextLane;
    junction.timerRemaining = junction.lanes[nextLane].allocatedGreen;
    junction.metrics.totalCyclesCompleted = (junction.metrics.totalCyclesCompleted || 0) + 1;

    const logEntry = {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        junctionId: junction.id,
        event: 'Signal Phase Advance',
        detail: `Green light switched to ${nextLane} lane for ${junction.timerRemaining}s.`
    };
    db.logs.unshift(logEntry);
    if (db.logs.length > 50) db.logs.pop();

    writeDB(db);
    res.json({ success: true, data: junction, log: logEntry });
});

// 7. GET /api/traffic/logs - Event logs
router.get('/logs', (req, res) => {
    const db = readDB();
    res.json({ success: true, count: db.logs.length, data: db.logs });
});

module.exports = router;
