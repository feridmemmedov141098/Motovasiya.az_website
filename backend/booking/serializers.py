from rest_framework import serializers
from .models import Instructor, Motorcycle, Booking


class InstructorSerializer(serializers.ModelSerializer):
    """Serializer for Instructor model"""
    
    class Meta:
        model = Instructor
        fields = ['id', 'name', 'surname', 'email', 'bio', 'photo', 'active', 'is_admin', 'created_at']
        read_only_fields = ['id', 'created_at']


class MotorcycleSerializer(serializers.ModelSerializer):
    """Serializer for Motorcycle model"""
    
    class Meta:
        model = Motorcycle
        fields = ['id', 'name', 'image', 'description', 'active', 'created_at']
        read_only_fields = ['id', 'created_at']


class BookingSerializer(serializers.ModelSerializer):
    """Serializer for Booking model"""
    customer = serializers.SerializerMethodField()
    instructorId = serializers.IntegerField(source='instructor.id', read_only=True)
    motorcycleId = serializers.IntegerField(source='motorcycle.id', read_only=True)
    timeSlot = serializers.CharField(source='time_slot')
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'instructorId', 'motorcycleId', 'date', 'timeSlot', 
            'status', 'customer', 'createdAt'
        ]
        read_only_fields = ['id', 'createdAt']
    
    def get_customer(self, obj):
        """Return customer data in frontend format"""
        return obj.customer


class BookingCreateSerializer(serializers.Serializer):
    """Serializer for creating bookings (matches frontend format)"""
    motorcycleId = serializers.IntegerField()
    instructorId = serializers.IntegerField()
    date = serializers.DateField()
    timeSlot = serializers.CharField()
    customer = serializers.DictField()
    
    def create(self, validated_data):
        customer_data = validated_data.pop('customer')
        
        booking = Booking.objects.create(
            instructor_id=validated_data['instructorId'],
            motorcycle_id=validated_data['motorcycleId'],
            date=validated_data['date'],
            time_slot=validated_data['timeSlot'],
            customer_name=customer_data['name'],
            customer_surname=customer_data['surname'],
            customer_gender=customer_data['gender'],
            customer_age=customer_data['age'],
            customer_height_cm=customer_data['heightCm'],
            customer_phone=customer_data['phone'],
            status='pending'
        )
        return booking
