import { type NextFunction, type Request, type Response } from 'express'
import ExistentRegisterError from '../../application/error/existent-register.error'
import ExistentPaymentMethodError from '../../application/error/existent-payment-method.error'
import ForeignKeyError from '../../application/error/foreign-key.error'
import RepositoryGenericError from '../../application/error/repository-generic.error'
import UserUnauthorized from '../../application/error/user-unauthorized'
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ExistentRegisterError) {
    return res.status(409).json({ message: 'Existent register.' })
  }

  if (err instanceof ExistentPaymentMethodError) {
    return res.status(409).json({ message: 'Existent payment method.' })
  }

  if (err instanceof ForeignKeyError) {
    return res.status(409).json({ message: 'Some invalid key.' })
  }

  if (err instanceof RepositoryGenericError) {
    return res.status(500).json({ message: 'Server error.' })
  }

  if (err instanceof UserUnauthorized) {
    return res.status(401).json({ message: 'User unathorized.' })
  }

  return res.status(500).json({ message: 'Server error.' })
}
