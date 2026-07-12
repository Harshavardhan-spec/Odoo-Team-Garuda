from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import FuelLog
from .serializers import FuelLogSerializer
from .services import (
    create_fuel_log,
    update_fuel_log,
    delete_fuel_log,
    get_fuel_log_by_id,
    get_all_fuel_logs,
)


class FuelLogViewSet(viewsets.ModelViewSet):
    queryset = FuelLog.objects.all()
    serializer_class = FuelLogSerializer

    def list(self, request, *args, **kwargs):
        fuel_logs = get_all_fuel_logs()
        serializer = self.get_serializer(fuel_logs, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None, *args, **kwargs):
        fuel_log = get_fuel_log_by_id(pk)
        serializer = self.get_serializer(fuel_log)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        fuel_log = create_fuel_log(request.data)
        serializer = self.get_serializer(fuel_log)
        data = serializer.data

        if getattr(fuel_log, "fuel_efficiency", None) is not None:
            data["fuel_efficiency"] = fuel_log.fuel_efficiency

        return Response(data, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None, *args, **kwargs):
        fuel_log = update_fuel_log(pk, request.data)
        serializer = self.get_serializer(fuel_log)
        data = serializer.data

        if getattr(fuel_log, "fuel_efficiency", None) is not None:
            data["fuel_efficiency"] = fuel_log.fuel_efficiency

        return Response(data)

    def partial_update(self, request, pk=None, *args, **kwargs):
        fuel_log = update_fuel_log(pk, request.data)
        serializer = self.get_serializer(fuel_log)
        data = serializer.data

        if getattr(fuel_log, "fuel_efficiency", None) is not None:
            data["fuel_efficiency"] = fuel_log.fuel_efficiency

        return Response(data)

    def destroy(self, request, pk=None, *args, **kwargs):
        delete_fuel_log(pk)
        return Response(
            {"message": "Fuel log deleted successfully."},
            status=status.HTTP_200_OK
        )
