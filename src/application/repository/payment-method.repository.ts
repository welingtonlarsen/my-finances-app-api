import type PaymentMethodEntity from '../../domain/entity/payment-method.entity'

export default interface PaymentMethodRepository {
  create: (paymentMethodEntity: PaymentMethodEntity) => Promise<PaymentMethodEntity>
  getByName: (name: string) => Promise<PaymentMethodEntity | null>
}
