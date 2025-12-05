from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Instructor, Motorcycle, Booking
from .serializers import (
    InstructorSerializer, 
    MotorcycleSerializer, 
    BookingSerializer,
    BookingCreateSerializer
)


class InstructorViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Instructor model
    Public: GET (list active instructors)
    Admin: POST, PATCH, DELETE, toggle-status
    """
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer
    
    def get_queryset(self):
        # Public endpoint shows only active instructors
        if self.action == 'list' and not self.request.user.is_authenticated:
            return Instructor.objects.filter(active=True)
        return Instructor.objects.all()
    
    def get_permissions(self):
        # Only list is public, everything else requires auth
        if self.action == 'list':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def toggle_status(self, request, pk=None):
        """Toggle instructor active status"""
        instructor = self.get_object()
        instructor.active = not instructor.active
        instructor.save()
        serializer = self.get_serializer(instructor)
        return Response(serializer.data)


class MotorcycleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Motorcycle model
    Public: GET (list active motorcycles)
    Admin: POST, DELETE
    """
    queryset = Motorcycle.objects.all()
    serializer_class = MotorcycleSerializer
    
    def get_queryset(self):
        # Public endpoint shows only active motorcycles
        if self.action == 'list' and not self.request.user.is_authenticated:
            return Motorcycle.objects.filter(active=True)
        return Motorcycle.objects.all()
    
    def get_permissions(self):
        # Only list is public, everything else requires auth
        if self.action == 'list':
            return [AllowAny()]
        return [IsAuthenticated()]


class BookingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Booking model
    Public: POST (create booking)
    Admin: GET (list), DELETE
    """
    queryset = Booking.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return BookingCreateSerializer
        return BookingSerializer
    
    def get_permissions(self):
        # Create is public, list and delete require auth
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def create(self, request, *args, **kwargs):
        """Create a new booking"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        
        # Return in the format expected by frontend
        response_serializer = BookingSerializer(booking)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def instructor_login(request):
    """
    Login endpoint for instructors
    Accepts email, returns JWT token and instructor data
    """
    email = request.data.get('email')
    
    if not email:
        return Response(
            {'error': 'Email is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        instructor = Instructor.objects.get(email=email)
    except Instructor.DoesNotExist:
        return Response(
            {'error': 'Instructor not found. Try narmin@motovasiya.az'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Generate JWT token
    refresh = RefreshToken()
    refresh['instructor_id'] = instructor.id
    refresh['email'] = instructor.email
    
    return Response({
        'token': str(refresh.access_token),
        'refresh': str(refresh),
        'instructor': InstructorSerializer(instructor).data
    })
