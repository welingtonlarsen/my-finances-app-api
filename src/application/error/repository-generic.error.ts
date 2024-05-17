export default class RepositoryGenericError extends Error {
  constructor (message: string) {
    super()
    this.message = message
  }
}
