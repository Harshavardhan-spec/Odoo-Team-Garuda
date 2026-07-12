from django.core.exceptions import ValidationError

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import TripSerializer
from .services import (
    create_trip,
    complete_trip,
    cancel_trip,
    update_trip,
    delete_trip,
    get_trip_by_id,
    get_all_trips,
    get_active_trips,
    get_completed_trips,
    get_cancelled_trips,
)


# ===================================
# List All Trips
# GET /api/trips/
# ===================================

class TripListView(APIView):

    def get(self, request):

        trips = get_all_trips()
        serializer = TripSerializer(trips, many=True)

        return Response(serializer.data)


# ===================================
# Create Trip
# POST /api/trips/create/
# ===================================

class TripCreateView(APIView):

    def post(self, request):

        try:
            trip = create_trip(request.data)

            serializer = TripSerializer(trip)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        except ValidationError as e:

            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


# ===================================
# Trip Details
# GET /api/trips/<id>/
# ===================================

class TripDetailView(APIView):

    def get(self, request, pk):

        try:
            trip = get_trip_by_id(pk)

            serializer = TripSerializer(trip)

            return Response(serializer.data)

        except ValidationError as e:

            return Response(
                {"error": str(e)},
                status=status.HTTP_404_NOT_FOUND
            )


# ===================================
# Update Trip
# PUT /api/trips/update/<id>/
# ===================================

class TripUpdateView(APIView):

    def put(self, request, pk):

        try:
            trip = update_trip(pk, request.data)

            serializer = TripSerializer(trip)

            return Response(serializer.data)

        except ValidationError as e:

            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


# ===================================
# Delete Trip
# DELETE /api/trips/delete/<id>/
# ===================================

class TripDeleteView(APIView):

    def delete(self, request, pk):

        try:
            delete_trip(pk)

            return Response(
                {"message": "Trip deleted successfully."},
                status=status.HTTP_200_OK
            )

        except ValidationError as e:

            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


# ===================================
# Complete Trip
# PUT /api/trips/complete/<id>/
# ===================================

class CompleteTripView(APIView):

    def put(self, request, pk):

        try:

            actual_distance = request.data.get("actual_distance")
            fuel_consumed = request.data.get("fuel_consumed")

            trip = complete_trip(
                pk,
                actual_distance,
                fuel_consumed
            )

            serializer = TripSerializer(trip)

            return Response(serializer.data)

        except ValidationError as e:

            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


# ===================================
# Cancel Trip
# PUT /api/trips/cancel/<id>/
# ===================================

class CancelTripView(APIView):

    def put(self, request, pk):

        try:

            trip = cancel_trip(pk)

            serializer = TripSerializer(trip)

            return Response(serializer.data)

        except ValidationError as e:

            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


# ===================================
# Active Trips
# GET /api/trips/active/
# ===================================

class ActiveTripView(APIView):

    def get(self, request):

        trips = get_active_trips()

        serializer = TripSerializer(
            trips,
            many=True
        )

        return Response(serializer.data)


# ===================================
# Completed Trips
# GET /api/trips/completed/
# ===================================

class CompletedTripView(APIView):

    def get(self, request):

        trips = get_completed_trips()

        serializer = TripSerializer(
            trips,
            many=True
        )

        return Response(serializer.data)


# ===================================
# Cancelled Trips
# GET /api/trips/cancelled/
# ===================================

class CancelledTripView(APIView):

    def get(self, request):

        trips = get_cancelled_trips()

        serializer = TripSerializer(
            trips,
            many=True
        )

        return Response(serializer.data)
