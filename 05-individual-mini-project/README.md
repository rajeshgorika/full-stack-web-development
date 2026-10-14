# Individual Mini Project: Smart Card Identity & Digital Wallet System 💳

> A Full-Stack MERN (MongoDB, Express.js, React.js, Node.js) web application simulating a contactless Smart Card (RFID/NFC) campus identity, turnstile gate access, and digital wallet payment ecosystem.

---

## 🌟 System Overview

The **Smart Card Identity & Digital Wallet System** centralizes campus operations into an interactive digital smart card:
- **Virtual Smart Card**: Realistic 3D card layout displaying EMV chip, contactless antenna waves, unique NFC/RFID UID, masked card numbers, cardholder details, and real-time wallet balances.
- **Access Control & POS Terminals**: Simulates tapping the card at diverse campus terminals (Cafeteria meal payments, Library turnstiles, Campus transit shuttles, and Computing labs).
- **Audio & Visual Tap Feedback**: Integrated with Web Audio API to reproduce authentic POS tone chimes upon successful authorization or rejection buzzers when a card is blocked or has insufficient balance.
- **Card Security & Lifecycle**: 1-click lost/stolen card locking to immediately prevent unauthorized transactions across all campus terminals.
- **Digital Wallet Recharge**: Instant top-up options (+₹100, +₹500, +₹1,000) or custom UPI payment simulations.
- **Live Transaction Ledger**: Real-time auditing of credits, payment debits, and access gate turnstile entries.
- **Card Issuance Portal**: Form to issue new smart cards with unique RFID/NFC UIDs, departments, and initial balances.

---

## 📁 Directory Structure

```
05-individual-mini-project/
│
├── README.md                      # Complete Project & Deployment Guide
├── Mini_Project_Report.pdf        # Academic Report & Project Synopsis
│
├── screenshots/
│   ├── application-dashboard.png  # UI Dashboard & Virtual Smart Card proof
│   └── api-deployment-proof.png   # Backend API execution & deployment proof
│
└── src/
    ├── client/                    # React Frontend SPA (Vercel Ready)
    │   ├── index.html
    │   ├── package.json
    │   ├── vercel.json            # Vercel SPA routing rewrite rules
    │   └── src/
    │       ├── App.jsx            # Interactive Smart Card & POS Terminal UI
    │       ├── App.css            # Dark mode glassmorphic styling
    │       └── main.jsx
    │
    └── server/                    # Express.js REST API Backend (Render Ready)
        ├── package.json
        ├── server.js              # REST server with health monitoring
        ├── .env.example           # Environment template
        ├── render.yaml            # Render Blueprint deployment config
        ├── config/
        │   └── db.js              # MongoDB Atlas connection utility
        ├── models/
        │   ├── SmartCard.js       # Cardholder, UID, Balance & Status schema
        │   └── Transaction.js     # Payments, Recharges & Access logs schema
        └── routes/
            └── api.js             # Card management, Tap-to-Pay & Ledger routes
```

---

## 📡 REST API Specifications

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/cards` | Retrieve all issued smart cards |
| `GET` | `/api/cards/:id` | Fetch specific card profile & current balance |
| `POST` | `/api/cards` | Issue a new smart card with NFC UID & initial balance |
| `PUT` | `/api/cards/:id/status` | Toggle card security status (`Active` ↔ `Blocked`) |
| `POST` | `/api/cards/:id/recharge` | Top up digital wallet funds |
| `POST` | `/api/cards/:id/tap` | Simulate POS payment or Gate access verification |
| `GET` | `/api/transactions` | Fetch latest transaction & turnstile access audit logs |
| `GET` | `/health` | Server health check endpoint |

---

## ⚙️ Local Development Setup

### 1. Backend Setup
```bash
cd 05-individual-mini-project/src/server
npm install
cp .env.example .env
# Edit .env (Optional: set MONGO_URI, default falls back to local memory store)
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

### A. Database: MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Set Network Access to `0.0.0.0/0` (allow connections from anywhere).
3. Copy your URI connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/smartcard_db?retryWrites=true&w=majority
   ```

### B. Backend: Render
1. Push this repository to your GitHub account.
2. In [Render Dashboard](https://dashboard.render.com/), select **New +** > **Web Service**.
3. Select your repository:
   - **Root Directory**: `05-individual-mini-project/src/server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. In **Environment Variables**, add:
   - `PORT`: `5000`
   - `MONGO_URI`: *Your MongoDB Atlas connection URI*
   - `CLIENT_URL`: `https://your-frontend.vercel.app` (or `*`)
5. Click **Deploy Web Service**.

### C. Frontend: Vercel
1. In [Vercel Dashboard](https://vercel.com/), select **Add New...** > **Project**.
2. Select your repository.
3. Edit the **Root Directory** to point to:
   `05-individual-mini-project/src/client`
4. Under **Environment Variables**, configure:
   - `REACT_APP_API_URL`: `https://your-backend-api.onrender.com/api`
5. Click **Deploy**.

---

## 🔗 Live Deployment URLs

- **Live Smart Card App**: `https://your-smart-card.vercel.app` *(update with your link)*
- **Deployed Backend API**: `https://your-smart-card-api.onrender.com` *(update with your link)*
- **API Health Check**: `https://your-smart-card-api.onrender.com/health`

---

## 👤 Author
- **Rajesh Gorika** - [@rajeshgorika](https://github.com/rajeshgorika)
