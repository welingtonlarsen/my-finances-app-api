import { type PaymentType } from '../../application/enum/payment-type.enum'

export default interface PaymentMethodQueryDTO {
  id: number
  name: string
  paymentType: PaymentType
}
