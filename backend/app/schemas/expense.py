"""
Expense Validation Schemas

TODO:
- Define fields for creating, updating, and returning expense objects
"""

from pydantic import BaseModel

class ExpenseBase(BaseModel):
    pass

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(ExpenseBase):
    pass

class ExpenseResponse(ExpenseBase):
    pass
