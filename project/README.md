# ContentHub — Full-Stack Content Platform

A full-stack content management platform with JWT authentication, paginated content APIs, and a polished React dashboard.

---

## Tech Stack

### Backend
- **Node.js + Express** — REST API server
- **Sequelize + SQLite** — ORM & database (zero setup required)
- **JWT (jsonwebtoken)** — Authentication
- **bcryptjs** — Password hashing
- **express-validator** — Input validation

### Frontend
- **React 18** — UI framework
- **Vite** — Build tool & dev server
- **React Router v6** — Client-side routing
- **Axios** — HTTP client
- **CSS Modules** — Scoped component styles

---

## Project Structure

```
content-platform/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js          # Register, Login, /me endpoints
│   │   └── content.js       # CRUD + paginated content API
│   ├── models.js            # Sequelize User & Content models
│   ├── server.js            # Express app entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ContentCard.jsx        # Content display card
    │   │   ├── CreateContentForm.jsx  # New content modal form
    │   │   ├── Pagination.jsx         # Prev/Next + page controls
    │   │   └── ProtectedRoute.jsx     # Auth guard component
    │   ├── context/
    │   │   └── AuthContext.jsx        # Global auth state
    │   ├── hooks/
    │   │   └── useContent.js          # Content fetching hook
    │   ├── pages/
    │   │   ├── Auth.jsx               # Login / Register page
    │   │   └── Dashboard.jsx          # Main content dashboard
    │   ├── utils/
    │   │   └── api.js                 # Axios instance + interceptors
    │   ├── App.jsx                    # Router setup
    │   ├── main.jsx                   # React entry point
    │   └── index.css                  # Global styles & variables
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Quick Start

### 1. Start the Backend

```bash
cd backend
npm install
npm start
```

The server will start on **http://localhost:5000**  
SQLite database is auto-created as `database.sqlite`.

### 2. Start the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will open on **http://localhost:3000**

---

## API Reference

All content endpoints require the `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Create account | No |
| POST | `/api/auth/login` | Login & get token | No |
| GET | `/api/auth/me` | Get current user | Yes |

**Register / Login body:**
```json
{
  "username": "alice",      // register only
  "email": "alice@example.com",
  "password": "password123"
}
```

### Content

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/content` | Create content | Yes |
| GET | `/api/content` | List with pagination | Yes |
| GET | `/api/content/:id` | Get single item | Yes |
| DELETE | `/api/content/:id` | Delete content | Yes |

**Create content body:**
```json
{
  "title": "My Article Title",
  "body": "Full content body text...",
  "category": "article",
  "status": "published",
  "tags": ["react", "javascript"]
}
```

**Paginated list query params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 10 | Items per page (max 100) |
| `category` | string | — | Filter by category |
| `status` | string | — | Filter by status |
| `search` | string | — | Search title & body |

**Pagination response:**
```json
{
  "success": true,
  "data": {
    "content": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 48,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPreviousPage": false,
      "nextPage": 2,
      "previousPage": null
    }
  }
}
```

---

## Data Models

### User
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| username | STRING(50) | Unique, 3–50 chars |
| email | STRING | Unique, valid email |
| password | STRING | bcrypt hashed |
| role | ENUM | `user` or `admin` |

### Content
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| title | STRING(200) | Required |
| body | TEXT | Required |
| category | ENUM | article, tutorial, news, review, other |
| tags | JSON array | Stored as JSON text |
| status | ENUM | published, draft, archived |
| views | INTEGER | Auto-incremented on fetch |
| authorId | UUID | Foreign key → User |

---

## Features Implemented

### Backend
- ✅ Data models for User and Content (Sequelize + SQLite)
- ✅ POST `/api/content` — create content (authenticated)
- ✅ GET `/api/content` — paginated content list (authenticated)
- ✅ JWT authentication middleware on all content routes
- ✅ Pagination metadata in every list response
- ✅ Input validation with express-validator
- ✅ Password hashing with bcrypt

### Frontend
- ✅ Create content form (modal) with category, status, tags
- ✅ Content dashboard with card grid display
- ✅ Paginated data fetching from backend
- ✅ Previous / Next controls + numbered page buttons
- ✅ Loading spinner state
- ✅ Error state with retry button
- ✅ Empty state with CTA
- ✅ Search + category + status filters
- ✅ Delete content with confirmation
- ✅ Auth context with login/register/logout
- ✅ Protected routes (redirect to login if unauthenticated)
- ✅ Token persistence via localStorage

---

## Environment Variables (Optional)

Create `backend/.env`:
```
PORT=5000
JWT_SECRET=your-very-secret-key-here
```
