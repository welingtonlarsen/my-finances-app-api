import type { PrismaClient } from '@prisma/client';
import PaymentMethodEntity from '../domain/entity/payment-method.entity';
import PaymentMethodDTO from '../domain/dto/payment-method.dto';
import ExistentPaymentMethodError from '../application/error/existent-payment-method.error';
import RepositoryGenericError from '../application/error/repository-generic.error';
import ORMUtil from '../infra/db/repository/orm.util';
import { Context } from '../infra/context/store.context';
import PaymentMethodFactory from '../domain/factory/payment-method.factory';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import ExistentRegisterError from '../application/error/existent-register.error';
import ClassTransformUtil from '../application/util/class-transform.util';
import PaymentMethodQueryDTO from '../query/dto/payment-method.query.dto';

export class PaymentMethodService {
  @Context('userId')
  private userId?: string;

  constructor(private readonly prismaClient: PrismaClient) {}

  async createPaymentMethod(paymentMethodDTO: PaymentMethodDTO): Promise<PaymentMethodEntity> {
    await this.verifyIfPaymentMethodExists(paymentMethodDTO.name);
    const paymentMethodEntity = PaymentMethodFactory.of(paymentMethodDTO);

    try {
      const ormPaymentMethod = await this.prismaClient.paymentMethod.create({
        data: {
          name: paymentMethodEntity.name,
          paymentType: paymentMethodEntity.paymentType,
          userId: Number(this.userId),
        },
      });
      const domainPaymentType = ORMUtil.parsePaymentTypeToDomain(ormPaymentMethod.paymentType);
      // TODO: Handle in factory
      return new PaymentMethodEntity(ormPaymentMethod.name, domainPaymentType, ormPaymentMethod.id);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002')
        throw new ExistentRegisterError(`Payment with name ${paymentMethodEntity.name} already exists.`);

      if (err instanceof RepositoryGenericError) throw err;

      throw new RepositoryGenericError(
        `Error trying to create the payment method: ${ClassTransformUtil.classToStringPlain(paymentMethodEntity)}`,
      );
    }
  }

  private async verifyIfPaymentMethodExists(paymentMethodName: string): Promise<void> {
    const existentPaymentMethod = await this.getByName(paymentMethodName);
    if (existentPaymentMethod !== null) {
      throw new ExistentPaymentMethodError(`Payment method with name "${paymentMethodName}" already exists.`);
    }
  }

  private async getByName(name: string): Promise<PaymentMethodEntity | null> {
    try {
      const ormPaymentMethod = await this.prismaClient.paymentMethod.findFirst({
        where: { name, userId: Number(this.userId) },
      });
      if (!ormPaymentMethod) return null;
      const domainPaymentType = ORMUtil.parsePaymentTypeToDomain(ormPaymentMethod.paymentType);
      return new PaymentMethodEntity(ormPaymentMethod.name, domainPaymentType, ormPaymentMethod.id);
    } catch (err) {
      if (err instanceof RepositoryGenericError) throw err;
      throw new RepositoryGenericError(`Error trying to get payment method by name ${name}`);
    }
  }

  async delete(id: number): Promise<void> {
    await this.prismaClient.$transaction(async (prisma) => {
      await prisma.expense.deleteMany({
        where: {
          paymentMethodId: id,
        },
      });

      await prisma.paymentMethod.delete({
        where: {
          id,
        },
      });
    });
  }

  async fetchAll(page: number = 1, size: number = 10): Promise<PaymentMethodQueryDTO[]> {
    if (page <= 0) throw new Error('Invalid page');
    const skip = (page - 1) * size;
    const paymentMethods = await this.prismaClient.paymentMethod.findMany({
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
