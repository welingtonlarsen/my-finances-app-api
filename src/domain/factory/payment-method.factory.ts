import type PaymentMethodDTO from '../dto/payment-method.dto'
import PaymentMethodEntity from '../entity/payment-method.entity'

export default class PaymentMethodFactory {
  static of (paymentMethodDTO: PaymentMethodDTO): PaymentMethodEntity {
    return new PaymentMethodEntity(paymentMethodDTO.name, paymentMethodDTO.paymentType)
  }
}
