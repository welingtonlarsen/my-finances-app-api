import { Context } from '../infra/context/store.context';
import type ExpensesSumQueryDTO from '../query/dto/expenses-sum.query.dto';
import type { PrismaClient } from '@prisma/client';

export default class ExpensesService {
  @Context('userId')
  private userId?: string;

  constructor(private readonly prisma: PrismaClient) {}

  async fetchSummedExpensesGroupedByPaymentType(startDate: string, endDate: string): Promise<ExpensesSumQueryDTO[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.prisma.$queryRaw<ExpensesSumQueryDTO[]>`
      SELECT COALESCE(sum(ex.amount), 0) as sum, pm.name as "paymentMethodName", pm.id as "paymentMethodId"
      FROM "PaymentMethod" pm
      LEFT JOIN "Expense" ex 
      ON ex."paymentMethodId" = pm.id 
      AND ex.date >= ${start} 
      AND ex.date <= ${end}
      WHERE pm."userId" = ${Number(this.userId)}
      GROUP BY pm.name, pm.id
      ORDER BY sum DESC;
    `;
  }
}
