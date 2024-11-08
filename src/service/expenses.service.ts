import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import ForeignKeyError from '../application/error/foreign-key.error';
import RepositoryGenericError from '../application/error/repository-generic.error';
import ClassTransformUtil from '../application/util/class-transform.util';
import ExpenseDTO from '../domain/dto/expenseDTO';
import ExpenseEntity from '../domain/entity/expense.entity';
import ExpenseFactory from '../domain/factory/expense.factory';
import { Context } from '../infra/context/store.context';
import type ExpensesSumQueryDTO from '../query/dto/expenses-sum.query.dto';
import type { PrismaClient } from '@prisma/client';
import ExpenseQueryDTO from '../query/dto/expense.query.dto';

export default class ExpensesService {
  @Context('userId')
  private userId?: string;

  constructor(private readonly prismaClient: PrismaClient) {}

  async createExpense(expenseDTO: ExpenseDTO): Promise<ExpenseEntity> {
    const expenseEntity = ExpenseFactory.of(expenseDTO);

    try {
      const { id, amount, description, date, categoryId, paymentMethodId, installments, currentInstallment } =
        await this.prismaClient.expense.create({
          data: {
            userId: Number(this.userId),
            ...expenseEntity,
          },
        });
      // TODO: Handle in factory
      return new ExpenseEntity(
        amount,
        description,
        date,
        categoryId,
        paymentMethodId,
        installments,
        currentInstallment,
        id,
      );
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2003') {
        throw new ForeignKeyError(
          `Foreign key error on expense "${ClassTransformUtil.classToStringPlain(expenseEntity)}".`,
        );
      }
      throw new RepositoryGenericError(
        `Error trying to persist expense "${ClassTransformUtil.classToStringPlain(expenseEntity)}".`,
      );
    }
  }

  async deleteExpense(expenseId: number): Promise<void> {
    try {
      await this.prismaClient.expense.delete({
        where: {
          id: expenseId,
        },
      });
    } catch (err) {
      throw new RepositoryGenericError(`Error trying to delete expense "${expenseId}".`);
    }
  }

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
