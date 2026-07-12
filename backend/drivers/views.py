from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import Driver
from .serializers import DriverSerializer
from .services import (
    create_driver,
    update_driver,
    delete_driver,
    get_driver_by_id,
    get_all_drivers,
)


class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer

    def list(self, request, *args, **kwargs):
        drivers = get_all_drivers()
        serializer = self.get_serializer(drivers, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None, *args, **kwargs):
        driver = get_driver_by_id(pk)
        serializer = self.get_serializer(driver)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        driver = create_driver(request.data)
        serializer = self.get_serializer(driver)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None, *args, **kwargs):
        driver = update_driver(pk, request.data)
        serializer = self.get_serializer(driver)
        return Response(serializer.data)

    def partial_update(self, request, pk=None, *args, **kwargs):
        driver = update_driver(pk, request.data)
        serializer = self.get_serializer(driver)
        return Response(serializer.data)

    def destroy(self, request, pk=None, *args, **kwargs):
        delete_driver(pk)
        return Response(
            {"message": "Driver deleted successfully."},
            status=status.HTTP_200_OK
        )
