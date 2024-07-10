import type ExpensesSumQueryDTO from '../query/dto/expenses-sum.query.dto'
import type { PrismaClient } from '@prisma/client'

export default class ExpensesService {
  constructor (private readonly prisma: PrismaClient) {}

  async fetchSummedExpensesGroupedByPaymentType (startDate: string, endDate: string): Promise<ExpensesSumQueryDTO[]> {
    const start = new Date(startDate)
    const end = new Date(endDate)

    return this.prisma.$queryRaw`
      SELECT COALESCE(sum(ex.amount), 0) as sum, pm.name as "paymentMethodName", pm.id as "paymentMethodId"
      FROM "Expense" ex
      RIGHT JOIN "PaymentMethod" pm ON ex."paymentMethodId" = pm.id
      WHERE ex.date >= ${start} AND ex.date <= ${end}
      GROUP BY pm."name", pm.id
      ORDER BY sum DESC;
    `
  }
}
