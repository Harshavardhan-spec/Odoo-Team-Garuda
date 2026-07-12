"""
API Dependency Injection Helpers

TODO:
- Configure database session injector
- Implement secure current user retrieval from JWT payload
- Implement Role-Based Access Control checker factory
"""

from typing import Generator, Any
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import SessionLocal

# OAuth2 scheme defining login endpoint URL
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login"
)

def get_db() -> Generator[Session, None, None]:
    """Dependency to retrieve local database session."""
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> Any:
    """
    TODO: Decode JWT token, verify claims, and query User record from database.
    """
    return None

class RoleChecker:
    """
    TODO: Verify authenticated user has allowed role classification.
    """
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: Any = Depends(get_current_user)) -> Any:
        """
        TODO: Perform Role check and raise HTTP 403 Forbidden if user is unauthorized.
        """
        return current_user
