import { type PrismaClient } from '@prisma/client'
import type PaymentMethodQueryDTO from './dto/payment-method.query.dto'
import ORMUtil from '../infra/db/repository/orm.util'

export default class PaymentMethodQuery {
  constructor (private readonly prisma: PrismaClient) {}

  async fetchAll (page: number = 1, size: number = 10): Promise<PaymentMethodQueryDTO[]> {
    if (page <= 0) throw new Error('Invalid page')
    const skip = (page - 1) * size
    const paymentMethods = await this.prisma.paymentMethod.findMany({ skip, take: size })

    const hydratedPaymentMethods = paymentMethods.map(method => {
      const domainPaymentType = ORMUtil.parsePaymentTypeToDomain(method.paymentType)
      return {
        ...method,
        paymentType: domainPaymentType
      }
    })

    return hydratedPaymentMethods
  }
}
