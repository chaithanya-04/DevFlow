# DevFlow — AI-powered Developer Workspace

> A full-stack project management platform with AI task generation, real-time Kanban collaboration, and intelligent project health analytics.

---

## Overview

DevFlow is a production-grade developer workspace designed for software teams. It combines traditional project management with AI-powered task generation and real-time collaboration — all built with a modern, scalable architecture.

**Why DevFlow?** Development teams waste hours manually breaking down projects into tasks and lose visibility across tools. DevFlow centralizes project planning, uses AI to accelerate task creation, and keeps teams synchronized in real time.

---

## Key Features

### Core Platform

- **JWT Authentication** — Secure signup/login with bcrypt-hashed passwords and protected routes
- **Role-Based Access Control** — Three-tier permissions:
  - **Admin**: Create/delete projects
  - **Project Manager**: Create/assign tasks, set priorities and deadlines
  - **Developer**: View assigned tasks, update status via Kanban
- **Project Management** — Full CRUD with descriptions, deadlines, and ownership
- **Task Management** — Priority levels, difficulty ratings, time estimates, due dates
- **Kanban Board** — Drag-and-drop interface across To Do → In Progress → Done
- **Real-Time Synchronization** — Socket.IO broadcasts task movements to all connected users instantly

### AI Integration (10–20% of product)

- **AI Task Generation** — Enter a project description (e.g., _"Build a food delivery app with login, cart, and payments"_), Groq API (Llama 3.3) generates structured tasks with priority, difficulty, and estimated time
- **AI Project Health Score** — Analyzes completed/pending/overdue tasks and taskcompletionrate to generate a 0–100 health score with actionable warnings

### Developer Experience

- **Dockerized** — Full containerization with Docker Compose for consistent local development
- **Production-Ready Architecture** — Separation of concerns, proper error handling, input validation, and secure environment variable management

---

## Tech Stack

| Layer              | Technology                                                      |
| ------------------ | --------------------------------------------------------------- |
| **Frontend**       | React 18, Vite, Tailwind CSS, React Router, Axios, Lucide React |
| **Backend**        | Node.js, Express.js, MongoDB + Mongoose                         |
| **Authentication** | JWT (jsonwebtoken), bcryptjs                                    |
| **AI**             | Groq API (Llama 3.3 70B)                                        |
| **Real-Time**      | Socket.IO                                                       |
| **DevOps**         | Docker, Docker Compose, Nginx                                   |
| **Database**       | MongoDB Atlas                                                   |

---

## System Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   React (Vite)  │◄────►│  Express + Node │◄────►│  MongoDB Atlas  │
│  Tailwind CSS   │      │   Socket.IO     │      │   (Cloud)       │
│   Axios         │      │   JWT Auth      │      └─────────────────┘
└─────────────────┘      │   Groq API      │
        ▲                └─────────────────┘
        │                         │
        └─────────────────────────┘
              WebSocket (Real-Time)
```

**Design Decisions:**

- **MongoDB Atlas** over self-hosted MongoDB for managed backups, scaling, and security
- **Socket.IO** for real-time but REST APIs for state-changing operations (reliable auth + validation)
- **Groq API** for fast, cost-effective LLM inference without managing model infrastructure
- **Docker multi-stage builds** for optimized frontend images (Node build → Nginx serve)

---

## Database Schema

```
User
 ├── _id (ObjectId)
 ├── name, email, password (bcrypt), role (enum)
 └── timestamps

Project
 ├── _id
 ├── name, description, startdate, deadline, status (enum)
 ├── owner → ref: User
 └── timestamps

Task
 ├── _id
 ├── title, description, status (To Do / In Progress / Done)
 ├── project → ref: Project
 ├── assignedTo → ref: User
 ├── createdBy → ref: User
 ├── priority (Low/Medium/High), difficulty (Easy/Medium/Hard)
 ├── estimatedTime, dueDate, completedAt
 └── timestamps
```

---

## Docker Setup

### Prerequisites

- Docker & Docker Compose
- MongoDB Atlas cluster (free M0 tier)

### Run with Docker Compose

```bash
# 1. Clone and navigate
git clone https://github.com/chaithanya-04/DevFlow
cd devflow

# 2. Create environment files
# backend/.env  (see Environment Variables section)
# frontend/.env

# 3. Build and start all services
docker-compose up --build

# 4. Access the application
# Frontend:  http://localhost:3000
# Backend:   http://localhost:5000
```

To stop:

```bash
docker-compose down
```

### Docker Structure

| Service    | Image                     | Ports       | Description               |
| ---------- | ------------------------- | ----------- | ------------------------- |
| `backend`  | `node:18-alpine`          | `5000:5000` | Express API server        |
| `frontend` | Multi-stage: Node → Nginx | `3000:80`   | React SPA served by Nginx |

**Why multi-stage frontend build?** The first stage builds the Vite app; the second stage copies only the static `dist/` files into Nginx. Result: a ~20MB image instead of ~500MB with Node.

---

## Quick Start for Reviewers

```bash
git clone https://github.com/chaithanya-04/DevFlow
cd devflow

# Option A: Docker (recommended)
docker-compose up --build

# Option B: Local
cd backend && npm install && npm run dev
# New terminal
cd frontend && npm install && npm run dev
```

Login with seeded admin:

- **Email:** `admin@devflow.com`
- **Password:** `admin123`

---

````
## Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/devflow
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRE=7d
GROQ_API_KEY=gsk_your_groq_api_key
CLIENT_URL=http://localhost:5173
````

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Local Installation (without Docker)

```bash
# Terminal 1 — Backend
cd backend
npm install
# Create .env file with variables above
npm run dev

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## Deployment Guide

DevFlow is configured for deployment on:

- **Frontend:** Vercel (React/Vite)
- **Backend:** Render (Node.js/Express)
- **Database:** MongoDB Atlas

### Pre-Deployment Checklist

- [ ] Set `CLIENT_URL` in Render to your Vercel production URL
- [ ] Set `VITE_API_URL` in Vercel to your Render production URL (`https://.../api`)
- [ ] Configure CORS in `server.js` to allow the production frontend origin
- [ ] Verify all environment variables are set in deployment dashboards (never in code)
- [ ] Run final end-to-end testing on production URLs

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint           | Access  | Description           |
| ------ | ------------------ | ------- | --------------------- |
| POST   | `/api/auth/signup` | Public  | Register new user     |
| POST   | `/api/auth/login`  | Public  | Login and receive JWT |
| GET    | `/api/auth/me`     | Private | Get current user      |

### Project Endpoints

| Method | Endpoint            | Access  | Description        |
| ------ | ------------------- | ------- | ------------------ |
| GET    | `/api/projects`     | Private | List all projects  |
| GET    | `/api/projects/:id` | Private | Get single project |
| POST   | `/api/projects`     | Admin   | Create project     |
| PUT    | `/api/projects/:id` | Admin   | Update project     |
| DELETE | `/api/projects/:id` | Admin   | Delete project     |

### Task Endpoints

| Method | Endpoint                | Access    | Description            |
| ------ | ----------------------- | --------- | ---------------------- |
| GET    | `/api/tasks`            | Private   | List tasks             |
| POST   | `/api/tasks`            | PM        | Create task            |
| PUT    | `/api/tasks/:id`        | PM        | Update task            |
| PUT    | `/api/tasks/:id/assign` | PM        | Assign task            |
| PUT    | `/api/tasks/:id/status` | All roles | Update status (Kanban) |
| DELETE | `/api/tasks/:id`        | PM        | Delete task            |

### AI & Analytics

| Method | Endpoint                 | Access  | Description         |
| ------ | ------------------------ | ------- | ------------------- |
| POST   | `/api/ai/generate-tasks` | PM      | AI task generation  |
| GET    | `/api/dashboard/stats`   | Private | Dashboard analytics |
| GET    | `/api/health/:projectId` | Private | AI health score     |

---

## Project Structure

```
devflow/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   ├── aiController.js
│   │   ├── dashboardController.js
│   │   └── healthController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── rbac.js            # Role authorization
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── project.js
│   │   ├── task.js
│   │   ├── ai.js
│   │   ├── dashboard.js
│   │   └── health.js
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env                   # gitignored
│   ├── .gitignore
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js       # Axios instance with interceptors
│   │   │   └── socket.js      # Socket.IO client
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── DashboardLayout.jsx
│   │   │   ├── kanban/
│   │   │   │   ├── TaskCard.jsx
│   │   │   │   └── KanbanColumn.jsx
│   │   │   ├── ai/
│   │   │   │   └── AIGenerateModal.jsx
│   │   │   ├── health/
│   │   │   │   └── ProjectHealth.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   ├── Tasks.jsx
│   │   │   └── Unauthorized.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .dockerignore
│   ├── .env                   # gitignored
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## Performance & Security Highlights

- **Passwords hashed with bcrypt**
- **JWT tokens expire in 7 days** with secure payload (userId + role)
- **CORS configured** for explicit origin allowlist
- **RBAC middleware** prevents unauthorized access at the route level
- **Input validation** on all controllers with descriptive error messages
- **Optimistic UI updates** on Kanban for instant feedback, with server reconciliation
- **AI response sanitization** — markdown code blocks stripped, JSON validated before parsing

---

## Future Improvements

- [ ] Email notifications for overdue tasks (Nodemailer + cron)
- [ ] File attachments on tasks (AWS S3 / Cloudinary)
- [ ] Sprint planning with burndown charts
- [ ] GitHub webhook integration for commit tracking
- [ ] PWA support for mobile task updates

---

## Author

Built by **Chaithanya D K** as a production-level full-stack project for software engineering placements.

- **LinkedIn:** www.linkedin.com/in/chaithanya-d-k-a16272259
- **Email:** chaithanyadk04@gmail.com

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
