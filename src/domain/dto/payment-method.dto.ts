import { type PaymentType } from '../../application/enum/payment-type.enum'

export default interface PaymentMethodDTO {
  name: string
  paymentType: PaymentType
}
