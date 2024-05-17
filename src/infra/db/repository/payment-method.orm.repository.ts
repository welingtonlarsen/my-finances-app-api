import { type PrismaClient } from '@prisma/client'
import type PaymentMethodRepository from '../../../application/repository/payment-method.repository'
import PaymentMethodEntity from '../../../domain/entity/payment-method.entity'
import RepositoryGenericError from '../../../application/error/repository-generic.error'
import ClassTransformUtil from '../../../application/util/class-transform.util'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import ExistentRegisterError from '../../../application/error/existent-register.error'
import ORMUtil from './orm.util'

export default class PaymentMethodORMRepository implements PaymentMethodRepository {
  constructor (private readonly prismaClient: PrismaClient) {}

  async create (paymentMethodEntity: PaymentMethodEntity): Promise<PaymentMethodEntity> {
    try {
      const ormPaymentMethod = await this.prismaClient.paymentMethod.create({
        data: {
          name: paymentMethodEntity.name,
          paymentType: paymentMethodEntity.paymentType
        }
      })
      const domainPaymentType = ORMUtil.parsePaymentTypeToDomain(ormPaymentMethod.paymentType)
      // TODO: Handle in factory
      return new PaymentMethodEntity(ormPaymentMethod.name, domainPaymentType, ormPaymentMethod.id)
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') throw new ExistentRegisterError(`Payment with name ${paymentMethodEntity.name} already exists.`)
      if (err instanceof RepositoryGenericError) throw err
      throw new RepositoryGenericError(`Error trying to create the payment method: ${ClassTransformUtil.classToStringPlain(paymentMethodEntity)}`)
    }
  }

  async getByName (name: string): Promise<PaymentMethodEntity | null> {
    try {
      const ormPaymentMethod = await this.prismaClient.paymentMethod.findFirst({ where: { name } })
      if (!ormPaymentMethod) return null
      const domainPaymentType = ORMUtil.parsePaymentTypeToDomain(ormPaymentMethod.paymentType)
      return new PaymentMethodEntity(ormPaymentMethod.name, domainPaymentType, ormPaymentMethod.id)
    } catch (err) {
      if (err instanceof RepositoryGenericError) throw err
      throw new RepositoryGenericError(`Error trying to get payment method by name ${name}`)
    }
  }
}
