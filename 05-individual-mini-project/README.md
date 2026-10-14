# Individual Mini Project: Full-Stack Web Application 🚀

> An end-to-end Full-Stack MERN (MongoDB, Express.js, React.js, Node.js) web application built for the individual mini-project submission, ready for cloud deployment.

---

## 🌟 Project Overview

This mini project demonstrates a complete real-world full-stack architecture featuring:
- **Frontend**: Responsive Single Page Application (SPA) built with React.
- **Backend API**: RESTful Express.js server with modular controllers and middleware.
- **Database**: MongoDB with Mongoose ORM for data persistence and schema validation.
- **Deployment**: Production-ready deployment configurations for **Vercel** (Frontend) and **Render** (Backend).

---

## 📁 Directory Structure

```
05-individual-mini-project/
│
├── README.md
├── Mini_Project_Report.pdf
│
├── screenshots/
│   ├── application-dashboard.png
│   └── api-deployment-proof.png
│
└── src/
    ├── client/               # React Frontend SPA
    │   ├── index.html
    │   ├── package.json
    │   ├── vercel.json       # Deployment configuration for Vercel
    │   └── src/
    │       ├── App.jsx
    │       ├── App.css
    │       └── main.jsx
    │
    └── server/               # Express.js REST API Backend
        ├── package.json
        ├── server.js
        ├── .env.example      # Environment variables template
        ├── render.yaml       # Deployment configuration for Render
        ├── config/
        │   └── db.js
        ├── models/
        │   └── Task.js
        └── routes/
            └── api.js
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, HTML5, CSS3 Modern Flexbox/Grid |
| **Backend** | Node.js, Express.js, CORS, Dotenv |
| **Database** | MongoDB Atlas (Cloud), Mongoose ODM |
| **Deployment** | Vercel (Client) + Render (Server) |
| **Testing** | Postman, Chrome DevTools |

---

## ⚙️ Local Development Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or newer)
- [MongoDB](https://www.mongodb.com/) (Local Community Server or free MongoDB Atlas cluster)

### 2. Backend Setup
```bash
cd src/server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and desired PORT
npm start
```
The server will start on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd src/client
npm install
npm start
```
The client will start on `http://localhost:3000` (or `http://localhost:5173`).

---

## 🌐 Cloud Deployment Guide

### A. Database: MongoDB Atlas (Free Cloud Cluster)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free Shared Cluster.
2. Under **Network Access**, add IP Address `0.0.0.0/0` (allow access from anywhere for cloud hosting).
3. Under **Database Access**, create a database user and password.
4. Click **Connect** > **Drivers** and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/miniproject?retryWrites=true&w=majority
   ```

---

### B. Backend API Deployment: Render
1. Push your repository to GitHub.
2. Log in to [Render](https://render.com/) and click **New +** > **Web Service**.
3. Connect your GitHub repository:
   - **Root Directory**: `05-individual-mini-project/src/server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. In the **Environment Variables** section, add:
   - `PORT`: `5000`
   - `MONGO_URI`: `your_mongodb_atlas_connection_string`
   - `CLIENT_URL`: `https://your-frontend.vercel.app` (or `*`)
5. Click **Create Web Service**. Render will deploy your API and give you a public URL (e.g. `https://my-mini-project-api.onrender.com`).

---

### C. Frontend Deployment: Vercel
1. Log in to [Vercel](https://vercel.com/) and click **Add New...** > **Project**.
2. Select your repository.
3. In **Root Directory**, click edit and select:
   `05-individual-mini-project/src/client`
4. In **Environment Variables**, add:
   - `REACT_APP_API_URL`: `https://my-mini-project-api.onrender.com/api` (your deployed Render URL)
5. Click **Deploy**. Vercel will build and assign you a global HTTPS domain.

---

## 🔗 Live Deployment URLs

- **Live Application**: `https://your-mini-project.vercel.app` *(update with your live link)*
- **Deployed Backend API**: `https://your-mini-project-api.onrender.com` *(update with your live link)*
- **API Health Check**: `https://your-mini-project-api.onrender.com/health`

---

## 👤 Author
- **Rajesh Gorika** - [@rajeshgorika](https://github.com/rajeshgorika)
