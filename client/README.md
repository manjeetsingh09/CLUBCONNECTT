# 🏛️ RTU Connect — University Club Network

> A full-stack platform enabling Rajasthan Technical University (RTU) clubs to scale across 50+ affiliated colleges through structured onboarding, testing, and real-time collaboration.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Club Directory** | Browse 5 main RTU clubs with member counts, projects, and sub-branch stats |
| **Sub-Branch System** | Apply to open a local chapter at any affiliated college |
| **Aptitude Testing** | Timed MCQ assessments for proposed coordinators |
| **Leaderboard** | Points-based ranking of 12+ colleges with badges |
| **Events Hub** | Tech events (Hackathons, Workshops, Bootcamps) with speaker details |
| **Real-Time Chat** | Global and club-specific rooms via Socket.io |
| **Profile System** | Role badges, XP leveling, activity timelines |
| **Smart Search** | Live filtering on clubs and events |
| **RBAC** | Super Admin → Club Coordinator → College Coordinator → Member |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS v4, Vite, Framer Motion |
| Backend | Node.js, Express.js, Socket.io |
| Database | SQLite via Sequelize ORM |
| Auth | JWT + bcrypt |
| Icons | Lucide React |
| Notifications | react-hot-toast |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm

### 1. Backend
```bash
cd server
npm install
node seed/seed.js   # Seeds 40+ users, 12 colleges, 5 events
npm run dev         # Starts on http://localhost:5000
```

### 2. Frontend
```bash
cd client
npm install
npm run dev         # Starts on http://localhost:5173
```

### 3. Environment Variables
Create `server/.env`:
```env
PORT=5000
DATABASE_URL=sqlite:./database.sqlite
JWT_SECRET=rtu_connect_secret_key_2024
CLIENT_URL=http://localhost:5173
```

---

## 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | `admin@rtu.ac.in` | `password123` |
| **Club Coordinator** | `arjun@rtu.ac.in` | `password123` |
| **College Coordinator** | `neha@jecrc.ac.in` | `password123` |
| **Student Member** | `abhishek0@student.rtu.ac.in` | `password123` |

---

## 📁 Project Structure

```
hackathon/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Navbar, Sidebar
│   │   ├── context/           # AuthContext, SocketContext
│   │   ├── pages/             # Home, Dashboard, Events, Leaderboard, etc.
│   │   └── index.css          # Tailwind v4 theme
│   └── package.json
├── server/                    # Express backend
│   ├── config/                # Database config
│   ├── middleware/             # JWT auth + RBAC
│   ├── models/                # Sequelize models (User, Club, Event, etc.)
│   ├── routes/                # API endpoints
│   ├── seed/                  # Database seeder
│   ├── socket/                # Socket.io handlers
│   └── server.js              # Entry point
└── README.md
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/clubs` | List all clubs |
| GET | `/api/clubs/:id` | Club detail with sub-branches |
| GET | `/api/events` | List all events |
| GET | `/api/leaderboard` | Ranked sub-branches |
| GET | `/api/profile/:id` | User profile |
| POST | `/api/requests` | Submit sub-branch request |
| GET | `/api/tests/:type` | Fetch aptitude questions |

---

## 🎨 Design System

- **Theme**: Deep Navy (`#060b18`) + RTU Orange (`#f97316`)
- **Typography**: System font stack, bold/italic industrial style
- **Effects**: Glassmorphism, neon hover glows, animated skeletons
- **Components**: Custom `glass` utility, `btn-primary`, smooth Framer Motion transitions

---

## 👥 Affiliated Colleges (Seeded)

| # | College |
|---|---------|
| 1 | Arya College of Engineering, Jaipur |
| 2 | Poornima Institute of Engineering, Jaipur |
| 3 | Global Institute of Technology, Jaipur |
| 4 | Swami Keshvanand Institute of Technology (SKIT) |
| 5 | JECRC, Jaipur |
| 6 | Anand International College of Engineering |
| 7 | RIET, Jaipur |
| 8 | Maharishi Arvind Institute of Engineering |
| 9 | Shankara Institute of Technology |
| 10 | Bikaner Technical University College |
| 11 | Pacific University, Udaipur |
| 12 | Jodhpur Institute of Engineering (JIET) |

---

## 📜 License

This project was built for the RTU Connect Hackathon 2024.
