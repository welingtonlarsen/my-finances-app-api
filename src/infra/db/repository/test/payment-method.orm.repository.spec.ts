import { PrismaClient } from '@prisma/client'
import PaymentMethodORMRepository from '../payment-method.orm.repository'
import PaymentMethodEntity from '../../../../domain/entity/payment-method.entity'
import { PaymentType } from '../../../../application/enum/payment-type.enum'
import { faker } from '@faker-js/faker'
import RepositoryGenericError from '../../../../application/error/repository-generic.error'
import ExistentRegisterError from '../../../../application/error/existent-register.error'

const paymentMethodName = faker.finance.currencyName()
const paymentMethodEntity = new PaymentMethodEntity(paymentMethodName, PaymentType.PIX)
describe('Payment method ORM repository integration test', () => {
  const prismaClient = new PrismaClient()
  const paymentMethodORMRepository = new PaymentMethodORMRepository(prismaClient)

  beforeEach(async () => {
    await prismaClient.$executeRawUnsafe('TRUNCATE TABLE "PaymentMethod" RESTART IDENTITY CASCADE;')
  })

  describe('create', () => {
    it('creates a payment method', async () => {
      const result = await paymentMethodORMRepository.create(paymentMethodEntity)
      expect(result).toEqual(new PaymentMethodEntity(paymentMethodName, PaymentType.PIX, 1))
    })

    it('throws RepositoryGenericError when payment type of db does not match domain', async () => {
      const mockedResponse = { paymentType: 'any-payment-type' } as any
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      jest.spyOn(prismaClient.paymentMethod, 'create').mockResolvedValueOnce(mockedResponse)

      await (expect(paymentMethodORMRepository.create(paymentMethodEntity))).rejects
        .toStrictEqual(new RepositoryGenericError('Payment type "any-payment-type" of db does not match domain.'))
    })

    it('throws ExistentRegisterError when payment method name already exists', async () => {
      await paymentMethodORMRepository.create(paymentMethodEntity)
      await (expect(paymentMethodORMRepository.create(new PaymentMethodEntity(paymentMethodName, PaymentType.PIX)))).rejects
        .toStrictEqual(new ExistentRegisterError(`Payment with name ${paymentMethodName} already exists.`))
    })

    it('throws RepositoryGenericError when some unhandled database error', async () => {
      jest.spyOn(prismaClient.paymentMethod, 'create').mockRejectedValueOnce(new Error('Some unhandled database error'))

      await (expect(paymentMethodORMRepository.create(new PaymentMethodEntity(paymentMethodName, PaymentType.PIX)))).rejects
        .toStrictEqual(new RepositoryGenericError(`Error trying to create the payment method: ${JSON.stringify({ name: paymentMethodName, paymentType: PaymentType.PIX })}`))
    })
  })

  describe('getByName', () => {
    it('fetches a persisted payment method', async () => {
      await paymentMethodORMRepository.create(paymentMethodEntity)
      const result = await paymentMethodORMRepository.getByName(paymentMethodName)
      expect(result).toEqual(new PaymentMethodEntity(paymentMethodName, PaymentType.PIX, 1))
    })

    it('fetches a not persisted payment method', async () => {
      const result = await paymentMethodORMRepository.getByName(paymentMethodName)
      expect(result).toEqual(null)
    })

    it('throws RepositoryGenericError when payment type of db does not match domain', async () => {
      const mockedResponse = { paymentType: 'any-payment-type' } as any
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      jest.spyOn(prismaClient.paymentMethod, 'findFirst').mockResolvedValueOnce(mockedResponse)

      await (expect(paymentMethodORMRepository.getByName(paymentMethodName))).rejects
        .toStrictEqual(new RepositoryGenericError('Payment type "any-payment-type" of db does not match domain.'))
    })

    it('throws RepositoryGenericError when some unhandled database error', async () => {
      jest.spyOn(prismaClient.paymentMethod, 'findFirst').mockRejectedValueOnce(new Error('Some unhandled database error'))

      await (expect(paymentMethodORMRepository.getByName(paymentMethodName))).rejects
        .toStrictEqual(new RepositoryGenericError(`Error trying to get payment method by name ${paymentMethodName}`))
    })
  })
})
