export default class UserUnauthorized extends Error {
  constructor (message: string) {
    super()
    this.message = message
  }
}
