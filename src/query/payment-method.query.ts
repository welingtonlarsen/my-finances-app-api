import { type PrismaClient } from '@prisma/client';
import type PaymentMethodQueryDTO from './dto/payment-method.query.dto';
import ORMUtil from '../infra/db/repository/orm.util';
import { Context } from '../infra/context/store.context';

export default class PaymentMethodQuery {
  @Context('userId')
  private userId?: string;

  constructor(private readonly prisma: PrismaClient) {}

  async fetchAll(page: number = 1, size: number = 10): Promise<PaymentMethodQueryDTO[]> {
    if (page <= 0) throw new Error('Invalid page');
    const skip = (page - 1) * size;
    const paymentMethods = await this.prisma.paymentMethod.findMany({
      skip,
      take: size,
      where: { userId: Number(this.userId) },
    });

    const hydratedPaymentMethods = paymentMethods.map((method) => {
      const domainPaymentType = ORMUtil.parsePaymentTypeToDomain(method.paymentType);
      return {
        ...method,
        paymentType: domainPaymentType,
      };
    });

    return hydratedPaymentMethods;
  }
}
