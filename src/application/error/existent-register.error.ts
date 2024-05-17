export default class ExistentRegisterError extends Error {
  constructor (message: string) {
    super()
    this.message = message
  }
}
