from rest_framework import viewsets
from .models import FuelLog
from .serializers import FuelLogSerializer

class FuelLogViewSet(viewsets.ModelViewSet):
    queryset = FuelLog.objects.all()
    serializer_class = FuelLogSerializer
