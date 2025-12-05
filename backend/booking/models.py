from django.db import models
from django.contrib.auth.models import AbstractUser


class Instructor(models.Model):
    """Instructor model for motorcycle training"""
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    bio = models.TextField()
    photo = models.URLField(max_length=500)
    active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} {self.surname}"


class Motorcycle(models.Model):
    """Motorcycle model for training bikes"""
    name = models.CharField(max_length=100)
    image = models.URLField(max_length=500)
    description = models.TextField()
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Booking(models.Model):
    """Booking model for motorcycle training sessions"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE, related_name='bookings')
    motorcycle = models.ForeignKey(Motorcycle, on_delete=models.CASCADE, related_name='bookings')
    date = models.DateField()
    time_slot = models.CharField(max_length=10)  # e.g., "14:00"
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Customer information (stored as JSON-like fields)
    customer_name = models.CharField(max_length=100)
    customer_surname = models.CharField(max_length=100)
    customer_gender = models.CharField(max_length=10)
    customer_age = models.IntegerField()
    customer_height_cm = models.IntegerField()
    customer_phone = models.CharField(max_length=20)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['instructor', 'date', 'time_slot']

    def __str__(self):
        return f"{self.customer_name} {self.customer_surname} - {self.date} {self.time_slot}"

    @property
    def customer(self):
        """Return customer data in the format expected by frontend"""
        return {
            'name': self.customer_name,
            'surname': self.customer_surname,
            'gender': self.customer_gender,
            'age': self.customer_age,
            'heightCm': self.customer_height_cm,
            'phone': self.customer_phone,
        }
