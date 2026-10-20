# Assignment 2: Individual Project - Smart Traffic Signal Optimisation 🚦

> Adaptive Density-Weighted Traffic Signal Control System implemented using **HTML5, CSS3, React.js**, and a sample dummy database (**`data.json`**).

---

## 🌟 Overview

Conventional fixed-timer traffic signals result in unnecessary congestion, heightened idle emissions, and delays for emergency responders. The **Smart Traffic Signal Optimisation** project introduces an automated density-weighted scheduling approach that continuously monitors vehicle queues across all four intersection approaches and dynamically assigns optimal green light durations.

### Key Capabilities
- **4-Way Intersection Live Simulation**: Visual representation of North, South, East, and West lanes with animated signals, queue preview, and active countdown badges.
- **Adaptive Density Scheduling**: Green clearance times dynamically scale between $15\text{s}$ and $60\text{s}$ according to real-time traffic volume.
- **Emergency Priority Corridor**: Instant override for incoming ambulances or fire trucks, setting conflicting lanes to Red and creating an immediate clear path.
- **Eco-Analytics**: Tracks average wait times, throughput rate, fuel conserved, and carbon emissions averted.
- **Sample Dummy Database (`data.json`)**: Embedded JSON datastore containing junction states, lane metrics, and operational audit logs.

---

## 📁 Project Structure

```
Assignment-2-Individual-Project/
├── README.md
├── screenshots/
│   ├── traffic-simulation-dashboard.png
│   └── emergency-corridor-active.png
└── src/
    ├── index.html
    ├── style.css
    ├── App.jsx
    ├── components/
    │   ├── IntersectionVisualizer.jsx
    │   ├── LaneController.jsx
    │   ├── EmergencyPanel.jsx
    │   └── MetricsDisplay.jsx
    └── data.json
```

---

## 🧠 Adaptive Algorithm Formula

For any lane $L$ with vehicle count $V_L$ and road capacity $C_L = 45$:

$$T_{\text{green}} = \min\left(60\text{s}, \max\left(15\text{s}, 15 + \left(\frac{V_L}{C_L}\right) \times 45\right)\right)$$

---

## 🚀 How to Run

1. Open `src/index.html` in any modern web browser, or bundle with Vite / Create React App:
```bash
npm install
npm start
```
2. Interact with lane densities (+5, +10) to observe dynamic green duration recalculations.
3. Click any emergency dispatch button to witness instant green corridor preemption.

---

## 👤 Author
- **Rajesh Gorika** - [@rajeshgorika](https://github.com/rajeshgorika)
