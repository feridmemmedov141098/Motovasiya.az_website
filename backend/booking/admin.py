from django.contrib import admin
from .models import Instructor, Motorcycle, Booking


@admin.register(Instructor)
class InstructorAdmin(admin.ModelAdmin):
    list_display = ['name', 'surname', 'email', 'active', 'is_admin', 'created_at']
    list_filter = ['active', 'is_admin']
    search_fields = ['name', 'surname', 'email']
    ordering = ['-created_at']


@admin.register(Motorcycle)
class MotorcycleAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'active', 'created_at']
    list_filter = ['active']
    search_fields = ['name', 'description']
    ordering = ['-created_at']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['customer_name', 'customer_surname', 'instructor', 'motorcycle', 'date', 'time_slot', 'status', 'created_at']
    list_filter = ['status', 'date', 'instructor']
    search_fields = ['customer_name', 'customer_surname', 'customer_phone']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
