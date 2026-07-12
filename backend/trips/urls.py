from django.urls import path

from .views import (
    ActiveTripView,
    CancelledTripView,
    CancelTripView,
    CompleteTripView,
    CompletedTripView,
    TripCreateView,
    TripDeleteView,
    TripDetailView,
    TripListView,
    TripUpdateView,
)

urlpatterns = [
    path("", TripListView.as_view(), name="trip-list"),
    path("create/", TripCreateView.as_view(), name="trip-create"),
    path("<int:pk>/", TripDetailView.as_view(), name="trip-detail"),
    path("update/<int:pk>/", TripUpdateView.as_view(), name="trip-update"),
    path("delete/<int:pk>/", TripDeleteView.as_view(), name="trip-delete"),
    path("complete/<int:pk>/", CompleteTripView.as_view(), name="trip-complete"),
    path("cancel/<int:pk>/", CancelTripView.as_view(), name="trip-cancel"),
    path("active/", ActiveTripView.as_view(), name="active-trips"),
    path("completed/", CompletedTripView.as_view(), name="completed-trips"),
    path("cancelled/", CancelledTripView.as_view(), name="cancelled-trips"),
]
