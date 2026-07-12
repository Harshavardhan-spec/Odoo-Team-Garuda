"""
Expense Database Repository

TODO:
- Define expense-specific queries
"""

from app.crud.base import CRUDBase
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate

class CRUDExpense(CRUDBase[Expense, ExpenseCreate, ExpenseUpdate]):
    pass

expense = CRUDExpense(Expense)
