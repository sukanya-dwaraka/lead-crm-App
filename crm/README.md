# ⚡ LeadFlow CRM

A full-stack Lead Management CRM built with **React Vite** + **Node.js/Express** + **In-memory DB** (MongoDB-ready).

---

## 📁 Project Structure

```
crm/
├── backend/          # Express REST API
│   ├── server.js     # All API routes + in-memory data store
│   └── package.json
└── frontend/         # React + Vite SPA
    ├── src/
    │   ├── App.jsx               # Main app, all state management
    │   ├── utils/api.js          # API client
    │   └── components/
    │       ├── LeadTable.jsx     # Sortable table with actions
    │       ├── LeadModal.jsx     # Create/Edit form modal
    │       ├── ConfirmModal.jsx  # Delete confirmation
    │       ├── StatsPanel.jsx    # Analytics dashboard
    │       ├── StatusBadge.jsx   # Colored status chips
    │       ├── Pagination.jsx    # Page navigation
    │       └── Toast.jsx         # Notification toasts
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
npm install
npm run dev        # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:5173
```

Open **http://localhost:5173** — the Vite proxy forwards `/api/*` to the backend automatically.

---

## 🔌 API Reference

| Method | Endpoint             | Description                          |
|--------|----------------------|--------------------------------------|
| GET    | `/api/leads`         | List leads (search, filter, sort, paginate) |
| GET    | `/api/leads/stats`   | Dashboard statistics                 |
| GET    | `/api/leads/:id`     | Get single lead                      |
| POST   | `/api/leads`         | Create new lead                      |
| PUT    | `/api/leads/:id`     | Update lead                          |
| DELETE | `/api/leads/:id`     | Delete lead                          |
| GET    | `/api/health`        | Health check                         |

### Query Parameters for `GET /api/leads`

| Param       | Type    | Default      | Description                              |
|-------------|---------|--------------|------------------------------------------|
| `search`    | string  | —            | Search name, email, or company           |
| `status`    | string  | All          | Filter: New / Contacted / Qualified / Converted / Lost |
| `sortBy`    | string  | `createdAt`  | Sort field: name, company, status, createdAt |
| `sortOrder` | string  | `desc`       | `asc` or `desc`                          |
| `page`      | number  | `1`          | Page number                              |
| `limit`     | number  | `10`         | Items per page (max 50)                  |

### Lead Object Schema

```json
{
  "id": "uuid",
  "name": "Priya Sharma",
  "email": "priya@company.com",
  "phone": "+91 98765 43210",
  "company": "TechCorp India",
  "status": "Qualified",
  "notes": "Follow up after Q3 budget.",
  "createdAt": "2024-11-15T00:00:00.000Z",
  "updatedAt": "2024-11-15T00:00:00.000Z"
}
```

---

## 🗄️ Connecting a Real Database

### MongoDB (Mongoose)

```bash
npm install mongoose
```

Replace the `leads` array in `server.js` with:

```js
import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/leadflow');

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  company: { type: String, required: true },
  status: { type: String, enum: ['New','Contacted','Qualified','Converted','Lost'], default: 'New' },
  notes: String,
}, { timestamps: true });

const Lead = mongoose.model('Lead', LeadSchema);
```

Then replace each route handler to use `Lead.find()`, `Lead.create()`, etc.

### PostgreSQL (pg / Drizzle)

```bash
npm install pg drizzle-orm
```

Use the `Lead` schema with a `leads` table mirroring the same fields.

---

## ✨ Features

- **Dashboard Analytics** — total leads, pipeline breakdown, 6-month trend sparkbar, conversion rate
- **Full CRUD** — create, read, update, delete leads
- **Search** — debounced search across name, email, company
- **Filter** — filter by lead status with pill buttons
- **Sort** — click column headers to sort asc/desc
- **Pagination** — configurable page size (5/10/25/50), smart ellipsis
- **Form Validation** — client + server side
- **Toast Notifications** — success/error feedback
- **Responsive Design** — works on mobile and desktop
- **Dark Theme** — sleek dark UI with accent colors per status

---

## 🎨 Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React 18, Vite 5, Lucide Icons |
| Backend   | Node.js, Express 4            |
| Database  | In-memory (MongoDB/PG ready)  |
| Styling   | Pure CSS-in-JS (no Tailwind)  |
| Fonts     | Syne + DM Sans (Google Fonts) |

---

## 🌍 Deployment

### Render / Railway (Backend)
1. Push `backend/` as a Node.js service
2. Set `PORT` environment variable
3. Add `MONGO_URI` if using MongoDB

### Vercel (Frontend)
1. Push `frontend/` to GitHub
2. Import in Vercel, framework = Vite
3. Set env var `VITE_API_URL=https://your-backend.render.com`
4. Update `vite.config.js` proxy or use the env var in `api.js`

---

## 📝 Environment Variables

**Backend `.env`:**
```
PORT=5000
MONGO_URI=mongodb+srv://...
```

**Frontend `.env`:**
```
VITE_API_URL=http://localhost:5000
```
