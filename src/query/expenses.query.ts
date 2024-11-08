import { Context } from '../infra/context/store.context';
import type ExpensesSumQueryDTO from '../query/dto/expenses-sum.query.dto';
import type { PrismaClient } from '@prisma/client';
import ExpenseQueryDTO from '../query/dto/expense.query.dto';

export default class ExpensesQuery {
  @Context('userId')
  private userId?: string;

  constructor(private readonly prismaClient: PrismaClient) {}

  async fetchAll(
    page: number = 1,
    size: number = 10,
    startDate: string,
    endDate: string,
    paymentMethodIds?: number[],
  ): Promise<ExpenseQueryDTO> {
    if (page <= 0) throw new Error('Invalid page');
    const skip = (page - 1) * size;

    const expenses = await this.prismaClient.expense.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        userId: Number(this.userId),
        ...(paymentMethodIds && { paymentMethodId: { in: paymentMethodIds } }),
      },
      include: {
        paymentMethod: true,
      },
      skip,
      take: size,
      orderBy: [
        {
          date: 'desc',
        },
        {
          id: 'desc',
        },
      ],
    });

    // Fetch the totalAmount for all matching records
    const totalAmountResult = await this.prismaClient.expense.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        userId: Number(this.userId),
        ...(paymentMethodIds && { paymentMethodId: { in: paymentMethodIds } }),
      },
    });

    const totalAmount = totalAmountResult._sum.amount ?? 0; // Default to 0 if no records found

    return {
      expenses,
      totalAmount,
    };
  }

  async fetchSummedExpensesGroupedByPaymentType(startDate: string, endDate: string): Promise<ExpensesSumQueryDTO[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.prismaClient.$queryRaw<ExpensesSumQueryDTO[]>`
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
