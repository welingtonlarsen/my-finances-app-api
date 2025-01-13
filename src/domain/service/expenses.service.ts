import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import ForeignKeyError from '../../application/error/foreign-key.error';
import RepositoryGenericError from '../../application/error/repository-generic.error';
import ClassTransformUtil from '../../application/util/class-transform.util';
import ExpenseDTO from '../dto/expenseDTO';
import ExpenseEntity from '../entity/expense.entity';
import ExpenseFactory from '../factory/expense.factory';
import { Context } from '../../infra/context/store.context';
import type { PrismaClient } from '@prisma/client';
import { addMonths } from '../../application/util/date.utils';

export default class ExpensesService {
  @Context('userId')
  private userId?: string;

  constructor(private readonly prismaClient: PrismaClient) {}

  async createExpenses(expenseDTO: ExpenseDTO): Promise<ExpenseEntity[]> {
    const expenseEntity = ExpenseFactory.of(expenseDTO);
    const totalAmount = expenseEntity.amount;
    const totalInstallments = expenseEntity.installments;

    try {
      if (totalInstallments <= 1) {
        const { id, amount, description, date, categoryId, paymentMethodId, installments, currentInstallment } =
          await this.prismaClient.expense.create({
            data: {
              userId: Number(this.userId),
              ...expenseEntity,
            },
          });
        return [
          new ExpenseEntity(
            amount,
            description,
            date,
            categoryId,
            paymentMethodId,
            installments,
            currentInstallment,
            id,
          ),
        ];
      }

      // Calculate base amount per installment (rounded to 2 decimal places)
      const baseAmountPerInstallment = Math.floor((totalAmount / totalInstallments) * 100) / 100;

      // Calculate the remainder to add to the last installment
      const remainder = Math.round((totalAmount - baseAmountPerInstallment * totalInstallments) * 100) / 100;

      // Create all installments
      const createdExpenses = await Promise.all(
        Array.from({ length: totalInstallments }, async (_, index) => {
          const isLastInstallment = index === totalInstallments - 1;
          const installmentAmount = isLastInstallment ? baseAmountPerInstallment + remainder : baseAmountPerInstallment;
          const installmentDate = addMonths(expenseEntity.date, index);

          return await this.prismaClient.expense.create({
            data: {
              userId: Number(this.userId),
              amount: installmentAmount,
              description: expenseEntity.description,
              date: installmentDate,
              categoryId: expenseEntity.categoryId,
              paymentMethodId: expenseEntity.paymentMethodId,
              installments: totalInstallments,
              currentInstallment: index + 1,
            },
          });
        }),
      );

      return createdExpenses.map(
        (expense) =>
          new ExpenseEntity(
            expense.amount,
            expense.description,
            expense.date,
            expense.categoryId,
            expense.paymentMethodId,
            expense.installments,
            expense.currentInstallment,
            expense.id,
          ),
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
