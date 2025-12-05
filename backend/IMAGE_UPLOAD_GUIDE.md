# Image Upload Guide

## Folder Structure

Images are stored in the `backend/media/` directory:

```
backend/media/
├── instructors/     # Instructor profile photos
└── motorcycles/     # Motorcycle images
```

## How to Add Images

### Option 1: Using Django Admin Panel

1. Start the Django server: `python manage.py runserver`
2. Go to `http://localhost:8000/admin`
3. Create a superuser if you haven't: `python manage.py createsuperuser`
4. Login and navigate to Instructors or Motorcycles
5. Click on an item to edit
6. Use the "Choose File" button to upload an image
7. Save

### Option 2: Manual File Placement

1. Place your images in the appropriate folder:
   - Instructor photos: `backend/media/instructors/`
   - Motorcycle images: `backend/media/motorcycles/`

2. Update the database to reference the image:
   - For instructors: Set `photo` field to `instructors/filename.jpg`
   - For motorcycles: Set `image` field to `motorcycles/filename.jpg`

### Option 3: API Upload (Coming Soon)

The frontend will be updated to support image uploads through the admin panel.

## Image Requirements

- **Format**: JPG, PNG, GIF, WebP
- **Recommended Size**:
  - Instructor photos: 400x400px (square)
  - Motorcycle images: 800x600px (landscape)
- **Max File Size**: 5MB

## Accessing Images

Images are served at: `http://localhost:8000/media/`

Examples:
- `http://localhost:8000/media/instructors/narmin.jpg`
- `http://localhost:8000/media/motorcycles/pulsar.jpg`

## Default Images

If no image is uploaded, the system will use placeholder images from Unsplash.

## Production Deployment

For production, you should:
1. Use a CDN or cloud storage (AWS S3, Cloudinary, etc.)
2. Configure `django-storages` for cloud uploads
3. Set proper CORS headers for media files
