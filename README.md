# Full-Stack Web Development 🌐

> Comprehensive Academic Lab Portfolio, Topic-Wise Practice Modules, Assignments, and Assessments for Full-Stack Web Development (MERN Stack).

---

## 📑 Repository Structure

```
full-stack-web-development/
│
├── README.md
├── .gitignore
│
├── 01-observation-and-record/
│   ├── week-01-html5-and-css3/
│   │   ├── Observation_Week01.pdf
│   │   ├── Record_Week01.pdf
│   │   ├── screenshots/
│   │   │   ├── program1-form-output.png
│   │   │   └── program2-flexbox-output.png
│   │   └── src/
│   │       ├── index.html
│   │       ├── style.css
│   │       └── contact.html
│   │
│   ├── week-02-javascript-es6-and-dom/
│   │   ├── Observation_Week02.pdf
│   │   ├── Record_Week02.pdf
│   │   ├── screenshots/
│   │   │   ├── dom-manipulation-output.png
│   │   │   └── async-fetch-output.png
│   │   └── src/
│   │       ├── app.js
│   │       └── index.html
│   │
│   ├── week-03-node-and-express-js/
│   │   ├── Observation_Week03.pdf
│   │   ├── Record_Week03.pdf
│   │   ├── screenshots/
│   │   │   ├── express-server-terminal.png
│   │   │   └── postman-api-response.png
│   │   └── src/
│   │       ├── server.js
│   │       ├── package.json
│   │       └── routes/
│   │           └── api.js
│   │
│   ├── week-04-mongodb-and-mongoose/
│   │   ├── Observation_Week04.pdf
│   │   ├── Record_Week04.pdf
│   │   ├── screenshots/
│   │   │   ├── dbConfig.js
│   │   │   └── crud-operations-output.png
│   │   └── src/
│   │       ├── dbConfig.js
│   │       ├── models/
│   │       │   └── User.js
│   │       └── controllers/
│   │           └── userController.js
│   │
│   └── week-05-full-stack-integration-mern/
│       ├── Observation_Week05.pdf
│       ├── Record_Week05.pdf
│       ├── screenshots/
│       │   ├── frontend-ui-output.png
│       │   └── network-tab-api-call.png
│       └── src/
│           ├── client/         # React / Frontend App
│           └── server/         # Express & MongoDB Backend
│
├── 02-topic-wise-practice/
│   ├── 01-html-and-css/
│   │   ├── semantic-tags.html
│   │   ├── flexbox-grid-layout.css
│   │   └── responsive-navbar.html
│   │
│   ├── 02-javascript/
│   │   ├── array-methods-es6.js
│   │   ├── fetch-api-promises.js
│   │   └── event-listeners.js
│   │
│   ├── 03-node-and-express/
│   │   ├── basic-http-server.js
│   │   ├── express-middleware-demo.js
│   │   └── rest-api-crud.js
│   │
│   ├── 04-mongodb/
│   │   ├── mongoose-schema-validation.js
│   │   └── aggregation-queries.js
│   │
│   └── 05-frontend-frameworks/
│       ├── react-components-props/
│       └── state-management-hooks/
│
├── 03-assignments/
│   ├── assignment-01-responsive-portfolio/
│   │   ├── Problem_Statement.pdf
│   │   ├── screenshots/
│   │   │   ├── desktop-view.png
│   │   │   └── mobile-view.png
│   │   └── src/
│   │
│   └── assignment-02-restful-api-service/
│       ├── Problem_Statement.pdf
│       ├── screenshots/
│       │   └── postman-tests.png
│       └── src/
│
├── 04-assessments/
│   ├── internal-assessment-01/
│   │   ├── QuestionPaper_IA1.pdf
│   │   ├── screenshots/
│   │   │   └── exam-output-proof.png
│   │   └── src/
│   │
│   └── internal-assessment-02/
│       ├── QuestionPaper_IA2.pdf
│       ├── screenshots/
│       │   └── fullstack-app-demo.png
│       └── src/
│
└── 05-individual-mini-project/
    ├── README.md
    ├── Mini_Project_Report.pdf
    ├── screenshots/
    │   ├── application-dashboard.png
    │   └── api-deployment-proof.png
    └── src/
        ├── client/         # React Frontend (Vercel Ready)
        └── server/         # Express REST API (Render Ready)
```

---

## 🛠 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose ODM
- **Deployment**: Vercel (Client), Render (Server), MongoDB Atlas (Cloud DB)
- **Testing & Tooling**: Postman, Git, GitHub, Modern Web DevTools

---

## 📚 Curriculum Breakdown

### `01-observation-and-record`
Contains weekly lab work with academic documentation, execution screenshots, and clean source code:
- **Week 01**: HTML5 forms, modern tags, and CSS3 Flexbox layout.
- **Week 02**: JavaScript ES6 features (arrow functions, destructuring), DOM tree manipulation, and async fetch.
- **Week 03**: Node.js runtime environment, Express.js server, and REST API routing.
- **Week 04**: MongoDB database connectivity, Mongoose schema modeling, and CRUD controllers.
- **Week 05**: Full-Stack MERN integration combining client frontend with server backend.

### `02-topic-wise-practice`
Focused, standalone practice modules organized by technology:
- **01-html-and-css**: Semantic HTML, Flexbox/Grid layouts, and responsive navigation menus.
- **02-javascript**: ES6 Array methods (`map`, `filter`, `reduce`), Fetch API Promises, and DOM event listeners.
- **03-node-and-express**: Native Node `http` server, custom Express middleware, and REST CRUD API.
- **04-mongodb**: Mongoose schema validations, custom validators, pre-save hooks, and aggregation pipelines.
- **05-frontend-frameworks**: React component composition, props distribution, `useState`, and `useEffect`.

### `03-assignments`
Major term assignments with problem statements, proof screenshots, and complete solutions:
- **Assignment 01**: Fully responsive modern personal developer portfolio.
- **Assignment 02**: RESTful API microservice with comprehensive CRUD endpoints and validation.

### `04-assessments`
Internal lab assessments with question papers, execution screenshots, and practical implementations:
- **Internal Assessment 01**: Dynamic DOM filtering application.
- **Internal Assessment 02**: Full-stack MERN issue tracker / ticket system.

### `05-individual-mini-project`
**Smart Traffic Signal Optimisation System**:
- **Adaptive Density Scheduling**: Real-time traffic density evaluation with dynamic green light duration calculations (15s to 60s).
- **4-Way Crossroad Live Visualizer**: Interactive animated intersection canvas showing signal lamps, countdown timers, and vehicle queues.
- **Emergency Priority Corridor**: 1-click green corridor override for ambulances and fire engines.
- **Sample Dummy Database (JSON)**: Lightweight data persistence and inspection with `trafficDB.json`.
- **Cloud Deployment**: Ready-to-deploy configurations for Vercel (client SPA) and Render (Express backend).

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MongoDB](https://www.mongodb.com/) (Local Community Server or Atlas URI)
- Modern web browser (Chrome, Firefox, Safari)

### Running any Node/Express module:
```bash
cd <module-directory>/src
npm install
npm start
```

---

## 👤 Author
- **Rajesh Gorika** - [@rajeshgorika](https://github.com/rajeshgorika)
