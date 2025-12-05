from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'instructors', views.InstructorViewSet, basename='instructor')
router.register(r'motorcycles', views.MotorcycleViewSet, basename='motorcycle')
router.register(r'bookings', views.BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', views.instructor_login, name='instructor-login'),
]
