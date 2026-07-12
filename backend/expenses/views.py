from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import Expense
from .serializers import ExpenseSerializer
from .services import (
    create_expense,
    update_expense,
    delete_expense,
    get_expense_by_id,
    get_all_expenses,
)


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

    def list(self, request, *args, **kwargs):
        expenses = get_all_expenses()
        serializer = self.get_serializer(expenses, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None, *args, **kwargs):
        expense = get_expense_by_id(pk)
        serializer = self.get_serializer(expense)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        expense = create_expense(request.data)
        serializer = self.get_serializer(expense)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None, *args, **kwargs):
        expense = update_expense(pk, request.data)
        serializer = self.get_serializer(expense)
        return Response(serializer.data)

    def partial_update(self, request, pk=None, *args, **kwargs):
        expense = update_expense(pk, request.data)
        serializer = self.get_serializer(expense)
        return Response(serializer.data)

    def destroy(self, request, pk=None, *args, **kwargs):
        delete_expense(pk)
        return Response(
            {"message": "Expense record deleted successfully."},
            status=status.HTTP_200_OK
        )
