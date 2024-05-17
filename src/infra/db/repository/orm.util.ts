import { $Enums } from '@prisma/client'
import { PaymentType } from '../../../application/enum/payment-type.enum'
import RepositoryGenericError from '../../../application/error/repository-generic.error'

export default class ORMUtil {
  static parsePaymentTypeToDomain (ormPaymentType: $Enums.PaymentType): PaymentType {
    const paymentTypeDictionary = new Map([
      [$Enums.PaymentType.CREDIT_CARD, PaymentType.CREDIT_CARD],
      [$Enums.PaymentType.PIX, PaymentType.PIX],
      [$Enums.PaymentType.TED, PaymentType.TED],
      [$Enums.PaymentType.CASH, PaymentType.CASH],
      [$Enums.PaymentType.DEBIT_CARD, PaymentType.DEBIT_CARD]
    ])
    const domainPaymentType = paymentTypeDictionary.get(ormPaymentType)
    if (!domainPaymentType) throw new RepositoryGenericError(`Payment type "${ormPaymentType}" of db does not match domain.`)
    return domainPaymentType
  }
}
