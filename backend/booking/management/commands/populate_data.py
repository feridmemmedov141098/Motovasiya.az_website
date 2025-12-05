"""
Management command to populate initial data
"""
from django.core.management.base import BaseCommand
from booking.models import Instructor, Motorcycle, Booking
from datetime import date


class Command(BaseCommand):
    help = 'Populate database with initial data'

    def handle(self, *args, **kwargs):
        # Create instructor
        instructor, created = Instructor.objects.get_or_create(
            email='narmin@motovasiya.az',
            defaults={
                'name': 'Narmin',
                'surname': 'Mammadova',
                'bio': 'Professional certified instructor. Passionate about teaching safe riding techniques to new riders.',
                'photo': 'https://images.unsplash.com/photo-1622151834625-1e43d1a88b8f?auto=format&fit=crop&q=80&w=400',
                'active': True,
                'is_admin': True,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created instructor: {instructor}'))
        else:
            self.stdout.write(self.style.WARNING(f'Instructor already exists: {instructor}'))

        # Create motorcycle
        motorcycle, created = Motorcycle.objects.get_or_create(
            name='Bajaj Pulsar NS160',
            defaults={
                'image': 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800',
                'description': '160cc Street Fighter. Agile, powerful, and perfect for training.',
                'active': True,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created motorcycle: {motorcycle}'))
        else:
            self.stdout.write(self.style.WARNING(f'Motorcycle already exists: {motorcycle}'))

        # Create demo booking
        booking, created = Booking.objects.get_or_create(
            instructor=instructor,
            motorcycle=motorcycle,
            date=date.today(),
            time_slot='10:00',
            defaults={
                'customer_name': 'Demo',
                'customer_surname': 'User',
                'customer_gender': 'Male',
                'customer_age': 25,
                'customer_height_cm': 175,
                'customer_phone': '+994 50 000 00 00',
                'status': 'confirmed',
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created booking: {booking}'))
        else:
            self.stdout.write(self.style.WARNING(f'Booking already exists: {booking}'))

        self.stdout.write(self.style.SUCCESS('\n✅ Initial data populated successfully!'))
