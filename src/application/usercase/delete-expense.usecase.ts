import type ExpenseRepository from '../repository/expense.repository'

export class DeleeteExpenseUseCase {
  constructor (private readonly expenseRepository: ExpenseRepository) {}

  async execute (expenseId: number): Promise<void> {
    await this.expenseRepository.delete(expenseId)
  }
}
