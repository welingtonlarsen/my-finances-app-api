export default class ExistentPaymentMethodError extends Error {
  constructor (message: string) {
    super()
    this.message = message
    this.name = 'ExistentPaymentMethodError'
  }
}
