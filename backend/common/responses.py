from rest_framework.response import Response
from rest_framework import status

def success_response(message="Success", data=None, status_code=status.HTTP_200_OK):
    """
    Standardized success response envelope helper.
    """
    if data is None:
        data = {}
    return Response(
        {
            "success": True,
            "message": message,
            "data": data
        },
        status=status_code
    )

def error_response(message="Error", errors=None, status_code=status.HTTP_400_BAD_REQUEST):
    """
    Standardized failure response envelope helper.
    """
    if errors is None:
        errors = {}
    return Response(
        {
            "success": False,
            "message": message,
            "errors": errors
        },
        status=status_code
    )
