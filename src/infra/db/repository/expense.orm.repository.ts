import type ExpenseRepository from '../../../application/repository/expense.repository'
import ExpenseEntity from '../../../domain/entity/expense.entity'
import { type PrismaClient } from '@prisma/client'
import ForeignKeyError from '../../../application/error/foreign-key.error'
import ClassTransformUtil from '../../../application/util/class-transform.util'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import RepositoryGenericError from '../../../application/error/repository-generic.error'

export default class ExpenseORMRepository implements ExpenseRepository {
  constructor (private readonly prismaClient: PrismaClient) {}

  async create (expenseEntity: ExpenseEntity): Promise<ExpenseEntity> {
    try {
      const {
        id,
        amount,
        description,
        date,
        categoryId,
        paymentMethodId,
        installments,
        currentInstallment
      } = await this.prismaClient.expense.create({
        data: expenseEntity
      })
      // TODO: Handle in factory
      return new ExpenseEntity(amount, description, date, categoryId, paymentMethodId, installments, currentInstallment, id)
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2003') {
        throw new ForeignKeyError(`Foreign key error on expense "${ClassTransformUtil.classToStringPlain(expenseEntity)}".`)
      }
      throw new RepositoryGenericError(`Error trying to persist expense "${ClassTransformUtil.classToStringPlain(expenseEntity)}".`)
    }
  }
}
