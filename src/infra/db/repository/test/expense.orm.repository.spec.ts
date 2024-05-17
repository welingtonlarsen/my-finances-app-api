import { PrismaClient } from '@prisma/client'
import ExpenseORMRepository from '../expense.orm.repository'
import ExpenseEntity from '../../../../domain/entity/expense.entity'
import { faker } from '@faker-js/faker'
import ForeignKeyError from '../../../../application/error/foreign-key.error'
import ClassTransformUtil from '../../../../application/util/class-transform.util'
import CategoryOrmRepository from '../category.orm.repository'
import PaymentMethodORMRepository from '../payment-method.orm.repository'
import CategoryEntity from '../../../../domain/entity/category.entity'
import PaymentMethodEntity from '../../../../domain/entity/payment-method.entity'
import { PaymentType } from '../../../../application/enum/payment-type.enum'
import RepositoryGenericError from '../../../../application/error/repository-generic.error'

const amount = Number(faker.finance.amount())
const description = faker.commerce.productName()
const date = new Date()
const id = 1
const installment = faker.number.int({ min: 1, max: 10 })
describe('Expense repository ORM test', () => {
  const prismaClient = new PrismaClient()
  const expenseRepository = new ExpenseORMRepository(prismaClient)
  const categoryRepository = new CategoryOrmRepository(prismaClient)
  const paymentMethodRepository = new PaymentMethodORMRepository(prismaClient)

  beforeEach(async () => {
    await prismaClient.$executeRawUnsafe('TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE;')
    await prismaClient.$executeRawUnsafe('TRUNCATE TABLE "PaymentMethod" RESTART IDENTITY CASCADE;')
    await prismaClient.$executeRawUnsafe('TRUNCATE TABLE "Expense" RESTART IDENTITY CASCADE;')
  })

  describe('create', () => {
    it('creates expense', async () => {
      // Setup category
      const categoryName = faker.finance.currencyName()
      const colorHexCode = faker.internet.color()
      await prismaClient.$executeRawUnsafe('TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE;')
      await categoryRepository.create(new CategoryEntity(categoryName, colorHexCode))

      // Setup payment method
      const paymentMethodName = faker.finance.currencyName()
      await prismaClient.$executeRawUnsafe('TRUNCATE TABLE "PaymentMethod" RESTART IDENTITY CASCADE;')
      await paymentMethodRepository.create(new PaymentMethodEntity(paymentMethodName, PaymentType.PIX))

      const expenseEntity = new ExpenseEntity(amount, description, date, id, id, installment, installment)
      const result = await expenseRepository.create(expenseEntity)
      expect(result).toStrictEqual(new ExpenseEntity(amount, description, date, id, id, installment, installment, 1))
    })

    it('throws ForeignKeyError when relation is invalid', async () => {
      const expenseEntity = new ExpenseEntity(amount, description, date, id, id, installment, installment)
      await (expect(expenseRepository.create(expenseEntity))).rejects
        .toStrictEqual(new ForeignKeyError(`Foreign key error on expense "${ClassTransformUtil.classToStringPlain(expenseEntity)}".`))
    })

    it('throws RepositoryGenericError when some unhandled database error', async () => {
      jest.spyOn(prismaClient.expense, 'create').mockRejectedValueOnce(new Error('Some unhandled database error'))
      const expenseEntity = new ExpenseEntity(amount, description, date, id, id, installment, installment)
      await (expect(expenseRepository.create(expenseEntity))).rejects
        .toStrictEqual(new RepositoryGenericError(`Error trying to persist expense "${ClassTransformUtil.classToStringPlain(expenseEntity)}".`))
    })
  })
})
