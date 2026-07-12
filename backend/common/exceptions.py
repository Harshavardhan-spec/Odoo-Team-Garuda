from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

def global_exception_handler(exc, context):
    """
    Centralized exception handler to convert all exceptions into standard
    project error payload formatting: { success: False, message: str, errors: dict }
    """
    response = exception_handler(exc, context)

    if response is not None:
        message = "An operational error occurred."
        errors = {}

        if isinstance(response.data, dict):
            if 'detail' in response.data:
                message = str(response.data['detail'])
                # Re-use standard details
                errors = response.data
            else:
                errors = response.data
                message = "Input validation failed."
        elif isinstance(response.data, list):
            errors = {"non_field_errors": response.data}
            message = str(response.data[0]) if response.data else "Validation failed."
        else:
            errors = {"error": str(response.data)}
            message = str(response.data)

        # Standardize formatting
        response.data = {
            "success": False,
            "message": message,
            "errors": errors
        }
    else:
        # Standard Python exceptions or DB connection failures
        logger.exception("Unexpected backend server error:")
        
        message = "An unexpected server error occurred."
        errors = {"detail": str(exc)}
        
        response = Response(
            {
                "success": False,
                "message": message,
                "errors": errors
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response
