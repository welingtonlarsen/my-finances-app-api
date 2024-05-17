import type ExpenseDTO from '../dto/expenseDTO'
import ExpenseEntity from '../entity/expense.entity'

export default class ExpenseFactory {
  static of (expenseDTO: ExpenseDTO): ExpenseEntity {
    return new ExpenseEntity(expenseDTO.amount, expenseDTO.description, expenseDTO.date, expenseDTO.categoryId, expenseDTO.paymentMethodId, expenseDTO.installments, expenseDTO.currentInstallment)
  }
}
