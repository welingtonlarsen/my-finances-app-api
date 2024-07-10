import { type PrismaClient } from '@prisma/client'
import type ExpenseQueryDTO from './dto/expense.query.dto'
import type ExpensesSumQueryDTO from './dto/expenses-sum.query.dto'

export default class ExpenseQuery {
  constructor (private readonly prisma: PrismaClient) {}

  async fetchAll (page: number = 1, size: number = 10, startDate: string, endDate: string): Promise<ExpenseQueryDTO> {
    if (page <= 0) throw new Error('Invalid page')
    const skip = (page - 1) * size

    const expenses = await this.prisma.expense.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        paymentMethod: true
      },
      skip,
      take: size,
      orderBy: {
        date: 'desc'
      }
    })

    const totalAmount = expenses.reduce((sum, current) => sum + current.amount, 0)

    return {
      expenses,
      totalAmount
    }
  }

  async fetchSummedExpensesGroupedByPaymentType (startDate: string, endDate: string): Promise<ExpensesSumQueryDTO> {
    const start = new Date(startDate)
    const end = new Date(endDate)

    return this.prisma.$queryRaw`
      SELECT sum(ex.amount) as sum, pm.name as "paymentMethodName", pm.id as "paymentMethodId"
      FROM "Expense" ex
      LEFT JOIN "PaymentMethod" pm ON ex."paymentMethodId" = pm.id
      WHERE ex.date >= ${start} AND ex.date <= ${end}
      GROUP BY pm."name", pm.id;
    `
  }
}
