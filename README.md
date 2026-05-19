# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack.

## Tech Stack

**Frontend:** React, TypeScript, TailwindCSS, Zustand, React Hook Form, Zod, Axios  
**Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcryptjs

## Features

- JWT Authentication (Register / Login)
- Role-Based Access Control (Admin / Sales)
- Full CRUD for Leads
- Advanced Filtering: Status, Source, Search (debounced)
- Sort by Latest / Oldest
- Backend Pagination (10 per page)
- CSV Export
- Responsive UI with loading & empty states
- Docker Setup

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally or MongoDB Atlas URI

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd smart-leads-dashboard
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173

## Docker Setup

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- MongoDB: localhost:27017

## API Documentation

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Leads (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/leads | Get all leads (with filters & pagination) |
| GET | /api/leads/:id | Get single lead |
| POST | /api/leads | Create lead |
| PUT | /api/leads/:id | Update lead |
| DELETE | /api/leads/:id | Delete lead (admin only) |
| GET | /api/leads/export/csv | Export leads as CSV |

### Query Parameters for GET /api/leads
- `status` - New | Contacted | Qualified | Lost
- `source` - Website | Instagram | Referral
- `search` - Search by name or email
- `sort` - latest | oldest
- `page` - Page number (default: 1)
- `limit` - Records per page (default: 10)

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```
