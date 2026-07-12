"""
User & Role Database Repository

TODO:
- Implement custom user queries (e.g. get user by email)
- Implement custom password hashing during creation
"""

from typing import Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.user import User, Role
from app.schemas.user import UserCreate, UserUpdate, RoleCreate, RoleUpdate

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        """
        TODO: Query a single user record matching their email address.
        """
        return None

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        """
        TODO: Hash password before saving user record.
        """
        return None

class CRUDRole(CRUDBase[Role, RoleCreate, RoleUpdate]):
    pass

user = CRUDUser(User)
role = CRUDRole(Role)
