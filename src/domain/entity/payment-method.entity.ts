import { type PaymentType } from '../../application/enum/payment-type.enum'

export default class PaymentMethodEntity {
  constructor (readonly name: string, readonly paymentType: PaymentType, id?: number) {}
}
