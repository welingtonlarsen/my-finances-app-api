import type PaymentMethodRepository from '../../repository/payment-method.repository'
import CreatePaymentMethodUseCase from '../create-payment-method.usecase'
import PaymentMethodEntity from '../../../domain/entity/payment-method.entity'
import { PaymentType } from '../../enum/payment-type.enum'
import ExistentPaymentMethodError from '../../error/existent-payment-method.error'

const name = 'Nubank credit card'
const paymentType = PaymentType.CREDIT_CARD

const mockedPaymentMethodRepository: jest.Mocked<PaymentMethodRepository> = {
  create: jest.fn(),
  getByName: jest.fn()
}

describe('Create payment method use case test', () => {
  const createPaymentMethodUseCase = new CreatePaymentMethodUseCase(mockedPaymentMethodRepository)

  it('creates payment method', async () => {
    mockedPaymentMethodRepository.getByName.mockResolvedValueOnce(null)
    mockedPaymentMethodRepository.create.mockResolvedValueOnce(new PaymentMethodEntity(name, paymentType))

    const result = await createPaymentMethodUseCase.execute({ name, paymentType })
    expect(result).toStrictEqual(new PaymentMethodEntity(name, paymentType))
  })

  it('throws ExistentPaymentMethodError when name of payment method already exists', async () => {
    mockedPaymentMethodRepository.getByName.mockResolvedValueOnce(new PaymentMethodEntity(name, paymentType))
    await expect(createPaymentMethodUseCase.execute({ name, paymentType }))
      .rejects.toStrictEqual(new ExistentPaymentMethodError(`Payment method with name "${name}" already exists.`))
  })
})
