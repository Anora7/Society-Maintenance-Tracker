# Society Maintenance Tracker

A full-stack platform for apartment societies to manage maintenance complaints,
track their full status history, surface overdue issues, run an admin
dashboard, and keep residents informed via a notice board and email
notifications.

## Tech Stack

- **Backend**: Django + Django REST Framework, JWT auth (SimpleJWT)
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Database**: PostgreSQL (Supabase/Neon in production, SQLite for local dev)
- **Photo storage**: Cloudinary
- **Email**: Django SMTP (Gmail), console backend for local dev
- **Hosting**: Render (backend), Vercel (frontend)

## Project Structure

```
backend/
  accounts/       # Custom User model, auth, profile, password change
  complaints/     # Complaint model, history, filters, overdue logic, dashboard
  notices/        # Notice board
  notifications/  # Email sending
  config/         # Django settings, root URLs
frontend/
  src/
    pages/        # All route-level pages
    components/   # Shared UI (Navbar, badges)
    lib/          # API client, auth context, types, route guard
```

## Local Setup

### Backend

```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env   # then fill in real values, see below
python manage.py migrate
python manage.py createsuperuser   # then set role='admin' via /admin/ panel or shell
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000/`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_BASE_URL
npm run dev
```

Frontend runs at `http://localhost:5173/`.

## Environment Variables

### `backend/.env`

```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=                          # blank = local SQLite fallback
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_HOST_USER=                       # blank = emails print to console instead of sending
EMAIL_HOST_PASSWORD=                   # Gmail App Password, not your normal password
OVERDUE_THRESHOLD_DAYS=5
```

### `frontend/.env`

```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## Database Schema

**`accounts.User`** (extends Django's `AbstractUser`)
| Field | Type | Notes |
|---|---|---|
| role | CharField | `resident` \| `admin`, default `resident` |
| flat_number | CharField | optional |

**`complaints.Complaint`**
| Field | Type | Notes |
|---|---|---|
| resident | FK → User | CASCADE |
| category | CharField | Plumbing / Electrical / Cleanliness / Security / Other |
| description | TextField | |
| photo | ImageField | optional, stored on Cloudinary |
| priority | CharField | Low / Medium / High, default Medium |
| status | CharField | Open / In Progress / Resolved, default Open |
| created_at | DateTimeField | auto |
| resolved_at | DateTimeField | set only when status becomes Resolved |

**`complaints.ComplaintStatusHistory`** — append-only log of every status change
| Field | Type | Notes |
|---|---|---|
| complaint | FK → Complaint | CASCADE |
| status | CharField | the status at this point in time |
| note | TextField | optional, set by the actor |
| changed_by | FK → User | SET_NULL on delete |
| changed_at | DateTimeField | auto |

**`notices.Notice`**
| Field | Type | Notes |
|---|---|---|
| title | CharField | |
| body | TextField | |
| is_important | BooleanField | pins to top of the board, triggers email |
| posted_by | FK → User | SET_NULL on delete |
| created_at | DateTimeField | auto |

**Overdue detection** is never stored — it's computed on every read as
`status != 'Resolved' AND now() - created_at > OVERDUE_THRESHOLD_DAYS days`,
centralized in `complaints/querysets.py`, so the threshold only lives in one
place (`OVERDUE_THRESHOLD_DAYS` env var).

## API Reference

All endpoints are prefixed `/api/`. Authenticated requests need
`Authorization: Bearer <access_token>`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register/` | Public | Create a resident account |
| POST | `/auth/login/` | Public | Returns `{access, refresh}` JWT pair |
| POST | `/auth/token/refresh/` | Public | Exchange refresh token for new access token |
| GET | `/auth/me/` | Any user | Current user info |
| PATCH | `/auth/me/` | Any user | Update own `flat_number` |
| POST | `/auth/change-password/` | Any user | `{old_password, new_password}` |
| GET | `/complaints/` | Any user | Resident: own only. Admin: all, with `?category=&status=&date_from=&date_to=` filters, overdue sorted first |
| POST | `/complaints/` | Resident | Multipart form: `category, description, photo?`. Auto-creates first "Open" history row |
| GET | `/complaints/<id>/` | Owner or admin | Full detail incl. `history[]` |
| PATCH | `/complaints/<id>/status/` | Admin | `{status, priority?, note?}` → updates complaint, appends history, emails resident |
| GET | `/notices/` | Any user | Important notices first, then by date |
| POST | `/notices/` | Admin | `{title, body, is_important}` → emails all residents if important |
| GET | `/dashboard/` | Admin | `{by_status[], by_category[], overdue_count}` |

### Example: raise a complaint

```
POST /api/complaints/
Authorization: Bearer <resident_access_token>
Content-Type: multipart/form-data

category=Plumbing
description=Leaking pipe in bathroom
photo=<file>
```

### Example: update status

```
PATCH /api/complaints/1/status/
Authorization: Bearer <admin_access_token>
Content-Type: application/json

{"status": "In Progress", "priority": "High", "note": "Plumber scheduled"}
```

## Sample Accounts

For testing/demo purposes, the following accounts are available on the live deployment:

| Username | Password | Role |
|---|---|---|
| Anora | anora123* | Admin |
| Resident1 | resident234* | Resident |
| Resident2 | resident123* | Resident |
| resident3 | resident345* | Resident |

## Deployment

1. **Database**: create a free Postgres instance on Supabase or Neon, copy
   the connection string into `DATABASE_URL` on Render.
2. **Photo storage**: create a free Cloudinary account, put the three keys
   into Render's environment variables.
3. **Email**: use a Gmail account with an
   [App Password](https://myaccount.google.com/apppasswords) (not your
   normal password) for `EMAIL_HOST_USER` / `EMAIL_HOST_PASSWORD`.
4. **Backend**: deploy `backend/` to Render as a Web Service.
   Build command: `pip install -r requirements.txt && python manage.py migrate`
   Start command: `gunicorn config.wsgi`
   Add all env vars from `.env.example` in the Render dashboard.
5. **Frontend**: deploy `frontend/` to Vercel. Set `VITE_API_BASE_URL` to
   your live Render backend URL (e.g. `https://your-app.onrender.com/api`).
6. Update `CORS_ALLOWED_ORIGINS` on the backend to your live Vercel URL.

## Notes

- Admins are created by promoting a resident's `role` to `admin` via
  Django's built-in admin panel at `/admin/` (log in with a superuser
  created via `createsuperuser`).
- Render's free tier sleeps after 15 minutes of inactivity — the first
  request after idling may take ~30–50 seconds to respond.
