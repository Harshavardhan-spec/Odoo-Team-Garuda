from rest_framework.permissions import BasePermission


class IsFleetManager(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "fleet_manager"
        )


class IsDispatcher(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "dispatcher"
        )


class IsSafetyOfficer(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "safety_officer"
        )


class IsFinancialAnalyst(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "financial_analyst"
        )