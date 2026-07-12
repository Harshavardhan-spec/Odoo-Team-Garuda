from django.urls import path
from .views import FleetReportView, ExpenseReportView, FuelReportView

urlpatterns = [
    path("fleet/", FleetReportView.as_view(), name="report-fleet"),
    path("expenses/", ExpenseReportView.as_view(), name="report-expenses"),
    path("fuel/", FuelReportView.as_view(), name="report-fuel"),
]
