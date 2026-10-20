# Group Project: Campus Resource & Lab Booking Portal 🏢

> A Collaborative Full-Stack MERN (MongoDB, Express.js, React.js, Node.js) web application designed for campus lab reservation and inventory management.

---

## 🌟 Overview

The **Campus Resource & Lab Booking Portal** streamlines access to specialized campus facilities (AI & GPU Compute clusters, Web Development labs, IoT & Robotics workstations, and Seminar Auditoriums).

### Core Features
- **Live Inventory Dashboard**: Real-time visualization of facility availability, total seat capacity, and current booking status.
- **1-Click Booking & Release**: Instant resource reservation with optimistic UI updates.
- **MERN Architecture**: Clean separation between a responsive React frontend (`client/`) and a resilient Express/MongoDB backend (`server/`).
- **Resilient Fallback**: Automatically serves in-memory seed records if local MongoDB daemon is offline during evaluation.

---

## 📁 Directory Structure

```
Group-Project/
├── README.md
├── screenshots/
│   ├── group-project-ui.png
│   └── backend-api-health.png
├── client/          # React Frontend SPA
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       └── main.jsx
└── server/          # Node + Express + MongoDB Backend
    ├── package.json
    ├── server.js
    ├── .env.example
    ├── config/
    │   └── db.js
    ├── models/
    │   └── Resource.js
    └── routes/
        └── api.js
```

---

## 🚀 How to Run

### 1. Run Backend Server
```bash
cd Group-Project/server
npm install
npm start
```
*Backend runs on `http://localhost:5000`.*

### 2. Run Frontend Client
```bash
cd Group-Project/client
npm install
npm start
```
*Frontend runs on `http://localhost:3000`.*

---

## 👥 Team & Roles
- **Frontend Architecture & React Components**: UI implementation and state management.
- **Backend API & REST Routing**: Express endpoints and CORS middleware.
- **Database Schema & Modeling**: Mongoose ORM models and validation.
- **Testing & Deployment**: API integration tests and documentation.
