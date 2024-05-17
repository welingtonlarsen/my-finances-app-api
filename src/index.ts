import 'express-async-errors'
import express, { type Request, type Response } from 'express'
import CreateCategoryUseCase from './application/usercase/create-category.usecase'
import CategoryOrmRepository from './infra/db/repository/category.orm.repository'
import { PrismaClient } from '@prisma/client'
import { errorHandler } from './infra/express/error-handler'
import ExpenseORMRepository from './infra/db/repository/expense.orm.repository'
import { CreateExpenseUseCase } from './application/usercase/create-expense.usecase'
import PaymentMethodORMRepository from './infra/db/repository/payment-method.orm.repository'
import CreatePaymentMethodUseCase from './application/usercase/create-payment-method.usecase'
import ExpenseQuery from './query/expense.query'
import CategoryQuery from './query/category.query'
import PaymentMethodQuery from './query/payment-method.query'
import cors from 'cors'

const port = process.env.PORT ?? 3000

const prismaClient = new PrismaClient()

const categoryRepository = new CategoryOrmRepository(prismaClient)
const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository)
const categoryQuery = new CategoryQuery(prismaClient)

const paymentMethodRepository = new PaymentMethodORMRepository(prismaClient)
const paymentMethodUseCase = new CreatePaymentMethodUseCase(paymentMethodRepository)
const paymentMethodQuery = new PaymentMethodQuery(prismaClient)

const expenseRepository = new ExpenseORMRepository(prismaClient)
const createExpenseUseCase = new CreateExpenseUseCase(expenseRepository)
const expenseQuery = new ExpenseQuery(prismaClient)

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (req: Request, res: Response) => {
  res.send('health ok')
})

app.get('/category', async (req: Request, res: Response) => {
  const { page, size } = req.query
  const result = await categoryQuery.fetchAll(page ? Number(page) : 1, size ? Number(size) : 10)
  return res.status(200).json(result)
})

app.post('/category', async (req: Request, res: Response) => {
  const { name, colorHexCode } = req.body
  const category = await createCategoryUseCase.execute({ name, colorHexCode })
  return res.status(201).json({ ...category })
})

app.get('/paymentmethod', async (req: Request, res: Response) => {
  const { page, size } = req.query
  const result = await paymentMethodQuery.fetchAll(page ? Number(page) : 1, size ? Number(size) : 10)
  return res.status(200).json(result)
})
app.post('/paymentmethod', async (req: Request, res: Response) => {
  const { name, paymentType } = req.body
  const paymentMethod = await paymentMethodUseCase.execute({ name, paymentType })
  return res.status(201).json({ ...paymentMethod })
})

app.get('/expense', async (req: Request, res: Response) => {
  const { page, size } = req.query
  const result = await expenseQuery.fetchAll(page ? Number(page) : 1, size ? Number(size) : 10)
  return res.status(200).json(result)
})

app.get('/expenses/sum', async (req: Request, res: Response) => {
  const result = await expenseQuery.fetchSummedExpensesGroupedByPaymentType()
  return res.status(200).json(result)
})

app.post('/expense', async (req: Request, res: Response) => {
  const { amount, description, date: dateStr, categoryId, paymentMethodId, installments, currentInstallment } = req.body
  const expense = await createExpenseUseCase.execute({ amount, description, date: new Date(dateStr as string), categoryId, paymentMethodId, installments, currentInstallment })
  return res.status(201).json(expense)
})

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
