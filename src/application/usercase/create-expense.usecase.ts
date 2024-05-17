import type ExpenseDTO from '../../domain/dto/expenseDTO'
import type ExpenseRepository from '../repository/expense.repository'
import ExpenseFactory from '../../domain/factory/expense.factory'
import type ExpenseEntity from '../../domain/entity/expense.entity'

export class CreateExpenseUseCase {
  constructor (private readonly expenseRepository: ExpenseRepository) {}

  async execute (expenseDTO: ExpenseDTO): Promise<ExpenseEntity> {
    const expenseEntity = ExpenseFactory.of(expenseDTO)
    return this.expenseRepository.create(expenseEntity)
  }
}
