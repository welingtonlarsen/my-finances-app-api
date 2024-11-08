import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import ForeignKeyError from '../../application/error/foreign-key.error';
import RepositoryGenericError from '../../application/error/repository-generic.error';
import ClassTransformUtil from '../../application/util/class-transform.util';
import ExpenseDTO from '../dto/expenseDTO';
import ExpenseEntity from '../entity/expense.entity';
import ExpenseFactory from '../factory/expense.factory';
import { Context } from '../../infra/context/store.context';
import type { PrismaClient } from '@prisma/client';

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
}
