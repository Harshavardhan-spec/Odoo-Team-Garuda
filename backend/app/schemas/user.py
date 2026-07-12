"""
User and Role Validation Schemas

TODO:
- Define field validations for login, registration, and user profiles
- Configure response serialization models
"""

from pydantic import BaseModel

class RoleBase(BaseModel):
    pass

class RoleCreate(RoleBase):
    pass

class RoleUpdate(RoleBase):
    pass

class RoleResponse(RoleBase):
    pass


class UserBase(BaseModel):
    pass

class UserCreate(UserBase):
    pass

class UserUpdate(UserBase):
    pass

class UserResponse(UserBase):
    pass


class Token(BaseModel):
    pass

class TokenPayload(BaseModel):
    pass
