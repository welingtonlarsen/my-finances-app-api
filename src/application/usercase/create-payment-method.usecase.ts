import type PaymentMethodDTO from '../../domain/dto/payment-method.dto'
import type PaymentMethodRepository from '../repository/payment-method.repository'
import ExistentPaymentMethodError from '../error/existent-payment-method.error'
import PaymentMethodFactory from '../../domain/factory/payment-method.factory'
import type PaymentMethodEntity from '../../domain/entity/payment-method.entity'

export default class CreatePaymentMethodUseCase {
  constructor (private readonly paymentMethodRepository: PaymentMethodRepository) {}

  async execute (paymentMethodDTO: PaymentMethodDTO): Promise<PaymentMethodEntity> {
    await this.verifyIfPaymentMethodExists(paymentMethodDTO.name)
    const paymentMethodEntity = PaymentMethodFactory.of(paymentMethodDTO)
    return this.paymentMethodRepository.create(paymentMethodEntity)
  }

  private async verifyIfPaymentMethodExists (paymentMethodName: string): Promise<void> {
    const existentPaymentMethod = await this.paymentMethodRepository.getByName(paymentMethodName)
    if (existentPaymentMethod !== null) {
      throw new ExistentPaymentMethodError(`Payment method with name "${paymentMethodName}" already exists.`)
    }
  }
}
