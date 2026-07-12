"""
Application Exceptions & Error Handlers

TODO:
- Define global exception model classes
- Configure custom API response error formatting
- Register exception handlers on the FastAPI app instance
"""

from fastapi import FastAPI

class AppError(Exception):
    """Base exception class for application errors."""
    pass

class EntityNotFoundError(AppError):
    """Exception raised when database entity is missing."""
    pass

class DuplicateEntityError(AppError):
    """Exception raised when unique constraints are violated."""
    pass

class AuthenticationError(AppError):
    """Exception raised on invalid login credentials."""
    pass

class PermissionDeniedError(AppError):
    """Exception raised on access policy denial."""
    pass

def setup_exception_handlers(app: FastAPI) -> None:
    """
    TODO: Register global exception handlers for the FastAPI application.
    """
    pass
