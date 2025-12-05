# Motovasiya Backend - Django REST API

This is the Django backend for the Motovasiya motorcycle training booking system.

## Features

- ✅ RESTful API with Django REST Framework
- ✅ JWT Authentication for instructors/admins
- ✅ CORS enabled for React frontend
- ✅ SQLite database (easily switchable to PostgreSQL)
- ✅ Admin panel at `/admin`
- ✅ Automatic API documentation

## Setup Instructions

### 1. Prerequisites
- Python 3.11+ installed
- Virtual environment activated

### 2. Installation

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies (if not already done)
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Populate initial data
python manage.py populate_data

# Create superuser for Django admin (optional)
python manage.py createsuperuser
```

### 3. Run Development Server

```bash
# Make sure virtual environment is activated
.\venv\Scripts\activate

# Start server
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Public Endpoints (No Authentication Required)

```
GET    /api/instructors/              - List active instructors
GET    /api/motorcycles/              - List active motorcycles
POST   /api/bookings/                 - Create new booking
POST   /api/auth/login/               - Instructor login
```

### Admin Endpoints (Authentication Required)

```
GET    /api/instructors/              - List all instructors
POST   /api/instructors/              - Add instructor
PATCH  /api/instructors/{id}/         - Update instructor
DELETE /api/instructors/{id}/         - Delete instructor
POST   /api/instructors/{id}/toggle_status/ - Toggle active status

GET    /api/motorcycles/              - List all motorcycles
POST   /api/motorcycles/              - Add motorcycle
DELETE /api/motorcycles/{id}/         - Delete motorcycle

GET    /api/bookings/                 - List all bookings
DELETE /api/bookings/{id}/            - Delete booking
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Login Example

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "narmin@motovasiya.az"}'
```

Response:
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "instructor": {
    "id": 1,
    "name": "Narmin",
    "surname": "Mammadova",
    "email": "narmin@motovasiya.az",
    "is_admin": true
  }
}
```

### Using the Token

Include the token in the Authorization header:

```bash
curl -X GET http://localhost:8000/api/bookings/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

## Default Credentials

- **Email**: narmin@motovasiya.az
- **Admin**: Yes

## Django Admin Panel

Access the Django admin at `http://localhost:8000/admin/`

Create a superuser:
```bash
python manage.py createsuperuser
```

## Database

Currently using SQLite for development. The database file is `db.sqlite3`.

### Switch to PostgreSQL (Production)

1. Install PostgreSQL and psycopg2:
```bash
pip install psycopg2-binary
```

2. Update `settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'motovasiya_db',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## Project Structure

```
backend/
├── manage.py                    # Django management script
├── requirements.txt             # Python dependencies
├── db.sqlite3                   # SQLite database
├── motovasiya_backend/          # Project settings
│   ├── settings.py              # Django settings
│   ├── urls.py                  # Main URL routing
│   └── wsgi.py                  # WSGI config
└── booking/                     # Main app
    ├── models.py                # Database models
    ├── serializers.py           # API serializers
    ├── views.py                 # API views
    ├── urls.py                  # App URL routing
    ├── admin.py                 # Django admin config
    └── management/
        └── commands/
            └── populate_data.py # Initial data command
```

## Troubleshooting

### CORS Errors
Make sure the frontend is running on `http://localhost:5173`. If using a different port, update `CORS_ALLOWED_ORIGINS` in `settings.py`.

### Database Errors
Delete `db.sqlite3` and run migrations again:
```bash
rm db.sqlite3
python manage.py migrate
python manage.py populate_data
```

### Port Already in Use
Run on a different port:
```bash
python manage.py runserver 8001
```

Then update `API_BASE_URL` in frontend's `mockApi.ts` to `http://localhost:8001/api`.

## Development Tips

- Use `python manage.py shell` for interactive Python shell with Django models
- Use `python manage.py dbshell` for direct database access
- Check logs in the terminal where the server is running
- API is automatically documented at `/api/` (browsable API)

## Next Steps

- [ ] Add email notifications for bookings
- [ ] Add password authentication
- [ ] Deploy to production (Heroku, AWS, DigitalOcean)
- [ ] Add automated tests
- [ ] Set up CI/CD pipeline
