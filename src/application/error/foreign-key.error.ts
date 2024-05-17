export default class ForeignKeyError extends Error {
  constructor (message: string) {
    super()
    this.message = message
  }
}
