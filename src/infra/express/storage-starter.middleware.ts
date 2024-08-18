import { type NextFunction, type Request, type Response } from 'express';
import { asyncLocalStorage } from '../context/store.context';

export function storeStarterMiddleware(req: Request, res: Response, next: NextFunction) {
  const store = new Map<string, string>();
  asyncLocalStorage.run(store, () => {
    next();
  });
}
