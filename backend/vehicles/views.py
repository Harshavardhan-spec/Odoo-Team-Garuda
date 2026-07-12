from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import VehicleSerializer
from .services import *
class VehicleCreateView(APIView):

    def post(self, request):

        vehicle = create_vehicle(request.data)

        serializer = VehicleSerializer(vehicle)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )
    class VehicleUpdateView(APIView):
    
        def put(self, request, pk):

            vehicle = update_vehicle(pk, request.data)

            serializer = VehicleSerializer(vehicle)

            return Response(serializer.data)
        
    class VehicleDeleteView(APIView):

        def delete(self, request, pk):

            delete_vehicle(pk)

            return Response(
                {
                    "message": "Vehicle deleted successfully."
            }
        )
    class VehicleListView(APIView):

        def get(self, request):

            vehicles = get_all_vehicles()

            serializer = VehicleSerializer(
                vehicles,
                many=True
            )

            return Response(serializer.data)
    class VehicleDetailView(APIView):

        def get(self, request, pk):

            vehicle = vehicle_details(pk)

            serializer = VehicleSerializer(vehicle)

            return Response(serializer.data)