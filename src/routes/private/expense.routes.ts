import { Router, type Request, type Response } from 'express';
import { authMiddleware } from '../../infra/express/auth.middleware';
import { getPrismaClient } from '../../infra/db/prisma.instance';
import ExpensesService from '../../domain/service/expenses.service';
import ExpensesQuery from '../../query/expenses.query';

const router = Router();
const prismaClient = getPrismaClient();

const expensesService = new ExpensesService(prismaClient);
const expensesQuery = new ExpensesQuery(prismaClient);

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

  const result = await expensesQuery.fetchAll(
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
  const result = await expensesQuery.fetchSummedExpensesGroupedByPaymentType(String(from), String(to));
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
  const expenses = await expensesService.createExpenses({
    amount,
    description,
    date: new Date(dateStr as string),
    categoryId,
    paymentMethodId,
    installments,
    currentInstallment,
  });
  return res.status(201).json(expenses);
});

router.delete('/expense/:id', authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  await expensesService.deleteExpense(Number(id));
  return res.status(204).send();
});

router.patch('/expense/:id', authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    amount,
    description,
    date: dateStr,
    categoryId,
    paymentMethodId,
    installments,
    currentInstallment,
  } = req.body;
  
  const updateDTO = { 
    id: Number(id),
    amount,
    description,
    categoryId,
    paymentMethodId,
    installments,
    currentInstallment,
    ...(dateStr !== undefined && { date: new Date(dateStr) }),
  };

  try {
    const updatedExpense = await expensesService.updateExpense(updateDTO);
    return res.status(200).json(updatedExpense);
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Failed to update expense' });
  }
});

export const expenseRoutes = router;
