import { Router, type Request, type Response } from 'express';
import { authMiddleware } from '../../infra/express/auth.middleware';
import { getPrismaClient } from '../../infra/db/prisma.instance';
import PaymentMethodQuery from '../../query/payment-method.query';
import { PaymentMethodService } from '../../service/payment-method.service';

const router = Router();
const prismaClient = getPrismaClient();

const paymentMethodService = new PaymentMethodService(prismaClient);

router.get('/paymentmethod', authMiddleware, async (req: Request, res: Response) => {
  const { page, size } = req.query;
  const result = await paymentMethodService.fetchAll(page ? Number(page) : 1, size ? Number(size) : 10);
  return res.status(200).json(result);
});
router.post('/paymentmethod', authMiddleware, async (req: Request, res: Response) => {
  const { name, paymentType } = req.body;
  const paymentMethod = await paymentMethodService.createPaymentMethod({ name, paymentType });
  return res.status(201).json({ ...paymentMethod });
});
router.delete('/paymentmethod/:id', authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  await paymentMethodService.delete(Number(id));
  return res.status(204).send();
});

export const paymentMethodRoutes = router;
