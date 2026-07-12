from django.core.exceptions import ValidationError

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import VehicleSerializer
from .services import (
    create_vehicle,
    delete_vehicle,
    get_all_vehicles,
    get_vehicle_by_id,
    update_vehicle,
)


class VehicleCreateView(APIView):
    def post(self, request):
        try:
            vehicle = create_vehicle(request.data)
            serializer = VehicleSerializer(vehicle)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class VehicleUpdateView(APIView):
    def put(self, request, pk):
        try:
            vehicle = update_vehicle(pk, request.data)
            serializer = VehicleSerializer(vehicle)
            return Response(serializer.data)
        except ValidationError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class VehicleDeleteView(APIView):
    def delete(self, request, pk):
        try:
            delete_vehicle(pk)
            return Response({"message": "Vehicle deleted successfully."}, status=status.HTTP_200_OK)
        except ValidationError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class VehicleListView(APIView):
    def get(self, request):
        vehicles = get_all_vehicles()
        serializer = VehicleSerializer(vehicles, many=True)
        return Response(serializer.data)


class VehicleDetailView(APIView):
    def get(self, request, pk):
        try:
            vehicle = get_vehicle_by_id(pk)
            serializer = VehicleSerializer(vehicle)
            return Response(serializer.data)
        except ValidationError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_404_NOT_FOUND)
