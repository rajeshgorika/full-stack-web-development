# Individual Mini Project: Smart Traffic Signal Optimisation 🚦

> An Adaptive Density-Weighted Traffic Signal Control System built using **HTML5, CSS3, React.js**, and an Express backend backed by a **Sample Dummy Database (JSON)**.

---

## 🌟 Problem Statement & Overview

Traditional traffic lights operate on rigid, static timers (e.g. 30 seconds per direction regardless of whether 2 cars or 50 cars are waiting). This causes unnecessary bottlenecks, increased idle emissions, wasted fuel, and delays for emergency responders (ambulances/fire engines).

The **Smart Traffic Signal Optimisation** system solves this by:
1. **Real-Time Density Monitoring**: Continuously evaluates vehicle count and queue lengths on North, South, East, and West lanes.
2. **Adaptive Density-Weighted Scheduling (ADWS)**: Dynamically calculates green light duration ($15\text{s}$ to $60\text{s}$) proportional to the real-time queue density.
3. **Emergency Green Corridor**: Provides instant 1-click override for emergency vehicles (ambulances, fire engines), automatically halting conflicting lanes with Red signals and clearing the transit path.
4. **Interactive 4-Way Intersection Simulator**: Visual crossroad canvas with animated glowing signals (🔴 🟡 🟢), countdown timers, and vehicle queue previews.
5. **Sample Dummy Database (JSON)**: Backed by `trafficDB.json` for lightweight persistence, inspection, and state restoration without requiring complex database engines.

---

## 📁 Directory Structure

```
05-individual-mini-project/
│
├── README.md                      # Comprehensive Project & Deployment Guide
├── Mini_Project_Report.pdf        # Academic Report & Project Synopsis
│
├── screenshots/
│   ├── application-dashboard.png  # UI Dashboard & 4-Way Intersection Simulator
│   └── api-deployment-proof.png   # Backend API execution & JSON DB proof
│
└── src/
    ├── client/                    # React Frontend SPA (Vercel Ready)
    │   ├── index.html
    │   ├── package.json
    │   ├── vercel.json            # Vercel SPA routing rewrite rules
    │   └── src/
    │       ├── App.jsx            # 4-Way Visualizer, Adaptive Timer, Emergency UI
    │       ├── App.css            # Dark mode crossroad & dashboard styling
    │       ├── main.jsx
    │       └── data/
    │           └── trafficDB.json # Sample Dummy Database (Client bundled)
    │
    └── server/                    # Express.js REST API Backend (Render Ready)
        ├── package.json
        ├── server.js              # REST server with health monitoring
        ├── .env.example           # Environment template
        ├── render.yaml            # Render Blueprint deployment config
        ├── data/
        │   └── trafficDB.json     # Sample Dummy Database (JSON File Store)
        └── routes/
            └── api.js             # Traffic control & optimization API endpoints
```

---

## 🧠 Adaptive Timing Algorithm

Green duration ($T_{\text{green}}$) for lane $L$ is dynamically computed as:

$$T_{\text{green}} = \min\left(T_{\max}, \max\left(T_{\min}, T_{\min} + \left(\frac{V_L}{C_L}\right) \times (T_{\max} - T_{\min})\right)\right)$$

Where:
- $T_{\min} = 15\text{ seconds}$ (Minimum clearance window)
- $T_{\max} = 60\text{ seconds}$ (Maximum green threshold)
- $V_L = \text{Current vehicle count on lane } L$
- $C_L = \text{Lane design capacity (45 vehicles)}$

---

## 📡 REST API Specifications

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/traffic/junctions` | Retrieve all intersections from the dummy JSON DB |
| `GET` | `/api/traffic/junctions/:id` | Get specific junction real-time status and lane metrics |
| `PUT` | `/api/traffic/junctions/:id/density` | Update a lane's vehicle count and recalculate green timing |
| `POST` | `/api/traffic/junctions/:id/emergency` | Activate emergency green corridor (ambulance/fire engine) |
| `PUT` | `/api/traffic/junctions/:id/mode` | Switch control mode (`Adaptive`, `Fixed`, or `Manual`) |
| `POST` | `/api/traffic/junctions/:id/next-phase` | Advance signal phase to next highest-priority lane |
| `GET` | `/api/traffic/logs` | Fetch real-time system audit logs |
| `GET` | `/health` | Server health check endpoint |

---

## 💾 Sample Dummy Database Schema (`trafficDB.json`)

```json
{
  "system": {
    "title": "Smart Traffic Signal Optimisation System",
    "version": "1.0.0",
    "algorithm": "Adaptive Density-Weighted Scheduling (ADWS)"
  },
  "junctions": [
    {
      "id": "J-101",
      "name": "Central Tech Square Junction",
      "mode": "Adaptive",
      "activeLane": "North",
      "timerRemaining": 24,
      "lanes": {
        "North": {
          "vehicleCount": 32,
          "capacity": 45,
          "congestion": "High",
          "signal": "Green",
          "allocatedGreen": 35,
          "emergencyVehicle": false
        }
      },
      "metrics": {
        "avgWaitTimeSec": 38,
        "throughputVehiclesPerMin": 64,
        "co2SavedKg": 142.8
      }
    }
  ],
  "logs": []
}
```

---

## ⚙️ Local Development Setup

### 1. Backend Setup
```bash
cd 05-individual-mini-project/src/server
npm install
npm start
```
The backend server runs on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd 05-individual-mini-project/src/client
npm install
npm start
```
The React frontend starts on `http://localhost:3000`.

---

## 🌐 Cloud Deployment Guide

### A. Backend: Render
1. Push this repository to GitHub.
2. In [Render Dashboard](https://dashboard.render.com/), click **New +** > **Web Service**.
3. Select your repository:
   - **Root Directory**: `05-individual-mini-project/src/server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Set Environment Variable:
   - `PORT`: `5000`
5. Click **Deploy Web Service**.

### B. Frontend: Vercel
1. In [Vercel Dashboard](https://vercel.com/), click **Add New...** > **Project**.
2. Select your repository.
3. Edit **Root Directory** to point to:
   `05-individual-mini-project/src/client`
4. Under **Environment Variables**, set:
   - `REACT_APP_API_URL`: `https://your-traffic-api.onrender.com/api/traffic`
5. Click **Deploy**.

---

## 👤 Author
- **Rajesh Gorika** - [@rajeshgorika](https://github.com/rajeshgorika)
