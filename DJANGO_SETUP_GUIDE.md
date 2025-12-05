# Django Backend Setup Guide

## Prerequisites Required

### ⚠️ Python Not Found
Python is not currently installed on your system. You need to install Python before we can create the Django backend.

### Installation Steps

#### 1. Install Python
1. Go to [python.org/downloads](https://www.python.org/downloads/)
2. Download **Python 3.11** or **Python 3.12** (recommended)
3. **IMPORTANT**: During installation, check ✅ "Add Python to PATH"
4. Click "Install Now"
5. Verify installation by opening a new terminal and running:
   ```bash
   python --version
   ```

#### 2. Install Django Backend (After Python is installed)

Run these commands in your project directory:

```bash
# Navigate to your project
cd c:\Users\Asus\Documents\GitHub\Motovasiya.az_website

# Create backend directory
mkdir backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install Django and dependencies
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt

# Create Django project
django-admin startproject motovasiya_backend .

# Create booking app
python manage.py startapp booking

# Run migrations
python manage.py migrate

# Create superuser (for Django admin)
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

## Next Steps After Installation

Once Python is installed, let me know and I'll:
1. Create all the Django files automatically
2. Set up the database models
3. Create the REST API endpoints
4. Update the frontend to use the real backend

## Alternative: Use Node.js Backend Instead?

If you prefer not to install Python, I can create a **Node.js/Express** backend instead, since you already have Node.js installed (for the React frontend). Would you prefer that option?

---

**Please let me know:**
- [ ] I'll install Python and continue with Django
- [ ] I prefer a Node.js/Express backend instead
