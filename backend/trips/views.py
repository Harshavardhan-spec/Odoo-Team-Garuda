from django.core.exceptions import ValidationError

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import TripSerializer
from .services import (
    cancel_trip,
    complete_trip,
    create_trip,
    delete_trip,
    get_active_trips,
    get_all_trips,
    get_cancelled_trips,
    get_completed_trips,
    get_trip_by_id,
    update_trip,
)


class TripListView(APIView):
    def get(self, request):
        trips = get_all_trips()
        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)


class TripCreateView(APIView):
    def post(self, request):
        try:
            trip = create_trip(request.data)
            serializer = TripSerializer(trip)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class TripDetailView(APIView):
    def get(self, request, pk):
        try:
            trip = get_trip_by_id(pk)
            serializer = TripSerializer(trip)
            return Response(serializer.data)
        except ValidationError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_404_NOT_FOUND)


class TripUpdateView(APIView):
    def put(self, request, pk):
        try:
            trip = update_trip(pk, request.data)
            serializer = TripSerializer(trip)
            return Response(serializer.data)
        except ValidationError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class TripDeleteView(APIView):
    def delete(self, request, pk):
        try:
            delete_trip(pk)
            return Response({"message": "Trip deleted successfully."}, status=status.HTTP_200_OK)
        except ValidationError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class CompleteTripView(APIView):
    def put(self, request, pk):
        try:
            trip = complete_trip(pk, request.data.get("actual_distance"), request.data.get("fuel_consumed"))
            serializer = TripSerializer(trip)
            return Response(serializer.data)
        except ValidationError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class CancelTripView(APIView):
    def put(self, request, pk):
        try:
            trip = cancel_trip(pk)
            serializer = TripSerializer(trip)
            return Response(serializer.data)
        except ValidationError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class ActiveTripView(APIView):
    def get(self, request):
        trips = get_active_trips()
        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)


class CompletedTripView(APIView):
    def get(self, request):
        trips = get_completed_trips()
        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)


class CancelledTripView(APIView):
    def get(self, request):
        trips = get_cancelled_trips()
        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)
