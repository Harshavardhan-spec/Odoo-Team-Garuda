from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import Maintenance
from .serializers import MaintenanceSerializer
from .services import (
    create_maintenance,
    update_maintenance,
    delete_maintenance,
    get_maintenance_by_id,
    get_all_maintenances,
)


class MaintenanceViewSet(viewsets.ModelViewSet):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer

    def list(self, request, *args, **kwargs):
        maintenances = get_all_maintenances()
        serializer = self.get_serializer(maintenances, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None, *args, **kwargs):
        maintenance = get_maintenance_by_id(pk)
        serializer = self.get_serializer(maintenance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        maintenance = create_maintenance(request.data)
        serializer = self.get_serializer(maintenance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None, *args, **kwargs):
        maintenance = update_maintenance(pk, request.data)
        serializer = self.get_serializer(maintenance)
        return Response(serializer.data)

    def partial_update(self, request, pk=None, *args, **kwargs):
        maintenance = update_maintenance(pk, request.data)
        serializer = self.get_serializer(maintenance)
        return Response(serializer.data)

    def destroy(self, request, pk=None, *args, **kwargs):
        delete_maintenance(pk)
        return Response(
            {"message": "Maintenance record deleted successfully."},
            status=status.HTTP_200_OK
        )
