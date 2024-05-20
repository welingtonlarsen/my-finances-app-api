import type ExpenseRepository from '../../repository/expense.repository'
import { CreateExpenseUseCase } from '../create-expense.usecase'
import { faker } from '@faker-js/faker'
import type ExpenseDTO from '../../../domain/dto/expenseDTO'
import ExpenseEntity from '../../../domain/entity/expense.entity'

const amount = Number(faker.finance.amount())
const description = faker.commerce.productName()
const date = new Date()
const id = 1
const installments = faker.number.int({ min: 1, max: 10 })

const mockedExpenseRepository: jest.Mocked<ExpenseRepository> = {
  create: jest.fn(),
  delete: jest.fn()
}

describe('Create expense use case test', () => {
  const createExpenseUseCase = new CreateExpenseUseCase(mockedExpenseRepository)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates expense', async () => {
    mockedExpenseRepository.create.mockResolvedValueOnce(new ExpenseEntity(amount, description, date, id, id, installments, installments, 1))
    const expenseDTO: ExpenseDTO = { amount, description, date, categoryId: id, paymentMethodId: id, installments, currentInstallment: installments }
    const result = await createExpenseUseCase.execute(expenseDTO)
    expect(result).toStrictEqual(new ExpenseEntity(amount, description, date, id, id, installments, installments, 1))
  })

  it('calls expense repository', async () => {
    mockedExpenseRepository.create.mockResolvedValueOnce(new ExpenseEntity(amount, description, date, id, id, installments, installments, 1))
    const expenseDTO: ExpenseDTO = { amount, description, date, categoryId: id, paymentMethodId: id, installments, currentInstallment: installments }
    await createExpenseUseCase.execute(expenseDTO)
    expect(mockedExpenseRepository.create).toHaveBeenCalledWith(new ExpenseEntity(amount, description, date, id, id, installments, installments))
    expect(mockedExpenseRepository.create).toHaveBeenCalledTimes(1)
  })
})
