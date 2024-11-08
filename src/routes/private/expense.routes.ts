import { Router, type Request, type Response } from 'express';
import { authMiddleware } from '../../infra/express/auth.middleware';
import { getPrismaClient } from '../../infra/db/prisma.instance';
import ExpensesService from '../../service/expenses.service';

const router = Router();
const prismaClient = getPrismaClient();

const expenseService = new ExpensesService(prismaClient);
const expensesService = new ExpensesService(prismaClient);

router.get('/expense', authMiddleware, async (req: Request, res: Response) => {
  const { page, size, from, to, paymentMethodIdsIn } = req.query;

  let sanitezedPaymentMethodsIdsIn: number[] | undefined = [];
  if (paymentMethodIdsIn) {
    sanitezedPaymentMethodsIdsIn =
      typeof paymentMethodIdsIn === 'string'
        ? JSON.parse(paymentMethodIdsIn)
        : (paymentMethodIdsIn as unknown as string[]).map((id) => Number(id));
  } else {
    sanitezedPaymentMethodsIdsIn = undefined;
  }

  const result = await expensesService.fetchAll(
    page ? Number(page) : 1,
    size ? Number(size) : 10,
    String(from),
    String(to),
    sanitezedPaymentMethodsIdsIn,
  );
  return res.status(200).json(result);
});

router.get('/expenses/sum', authMiddleware, async (req: Request, res: Response) => {
  const { from, to } = req.query;
  const result = await expensesService.fetchSummedExpensesGroupedByPaymentType(String(from), String(to));
  return res.status(200).json(result);
});

router.post('/expense', authMiddleware, async (req: Request, res: Response) => {
  const {
    amount,
    description,
    date: dateStr,
    categoryId,
    paymentMethodId,
    installments,
    currentInstallment,
  } = req.body;
  const expense = await expenseService.createExpense({
    amount,
    description,
    date: new Date(dateStr as string),
    categoryId,
    paymentMethodId,
    installments,
    currentInstallment,
  });
  return res.status(201).json(expense);
});

router.delete('/expense/:id', authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  await expenseService.deleteExpense(Number(id));
  return res.status(204).send();
});

export const expenseRoutes = router;
