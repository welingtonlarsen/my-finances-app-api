import type ExpenseEntity from '../../domain/entity/expense.entity'

export default interface ExpenseRepository {
  create: (expenseEntity: ExpenseEntity) => Promise<ExpenseEntity>
}
