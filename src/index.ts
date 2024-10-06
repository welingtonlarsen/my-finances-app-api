import 'express-async-errors';
import express, { type Request, type Response } from 'express';
import CreateCategoryUseCase from './application/usercase/create-category.usecase';
import CategoryOrmRepository from './infra/db/repository/category.orm.repository';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './infra/express/error-handler';
import ExpenseORMRepository from './infra/db/repository/expense.orm.repository';
import { CreateExpenseUseCase } from './application/usercase/create-expense.usecase';
import PaymentMethodORMRepository from './infra/db/repository/payment-method.orm.repository';
import CreatePaymentMethodUseCase from './application/usercase/create-payment-method.usecase';
import ExpenseQuery from './query/expense.query';
import CategoryQuery from './query/category.query';
import PaymentMethodQuery from './query/payment-method.query';
import cors from 'cors';
import { DeleeteExpenseUseCase } from './application/usercase/delete-expense.usecase';
import { PaymentMethodService } from './service/payment-method.service';
import ExpensesService from './service/expenses.service';
import UserService from './service/user.service';
import AuthService from './service/auth.service';
import { authMiddleware } from './infra/express/auth.middleware';
import morgan from 'morgan';
import { storeStarterMiddleware } from './infra/express/storage-starter.middleware';

const port = process.env.PORT ?? 3000;

const prismaClient = new PrismaClient();

const categoryRepository = new CategoryOrmRepository(prismaClient);
const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
const categoryQuery = new CategoryQuery(prismaClient);

const paymentMethodRepository = new PaymentMethodORMRepository(prismaClient);
const paymentMethodUseCase = new CreatePaymentMethodUseCase(paymentMethodRepository);
const paymentMethodQuery = new PaymentMethodQuery(prismaClient);
const paymentMethodService = new PaymentMethodService(prismaClient);

const expenseRepository = new ExpenseORMRepository(prismaClient);
const createExpenseUseCase = new CreateExpenseUseCase(expenseRepository);
const deleteExpenseUseCase = new DeleeteExpenseUseCase(expenseRepository);
const expenseQuery = new ExpenseQuery(prismaClient);
const expensesService = new ExpensesService(prismaClient);

const userService = new UserService(prismaClient);
const authService = new AuthService(prismaClient);

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.use(storeStarterMiddleware);

// public routes
app.get('/health', (req: Request, res: Response) => {
  res.send('health ok');
});

app.post('/users', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await userService.createUser({ name, email, password });
  return res.status(201).json(user);
});

app.post('/users/authenticate', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userDetails = await authService.authenticate({ email, password });
  return res.status(200).json(userDetails);
});

// private routes
app.get('/category', authMiddleware, async (req: Request, res: Response) => {
  const { page, size } = req.query;
  const result = await categoryQuery.fetchAll(page ? Number(page) : 1, size ? Number(size) : 10);
  return res.status(200).json(result);
});

app.post('/category', authMiddleware, async (req: Request, res: Response) => {
  const { name, colorHexCode } = req.body;
  const category = await createCategoryUseCase.execute({ name, colorHexCode });
  return res.status(201).json({ ...category });
});

app.get('/paymentmethod', authMiddleware, async (req: Request, res: Response) => {
  const { page, size } = req.query;
  const result = await paymentMethodQuery.fetchAll(page ? Number(page) : 1, size ? Number(size) : 10);
  return res.status(200).json(result);
});
app.post('/paymentmethod', authMiddleware, async (req: Request, res: Response) => {
  const { name, paymentType } = req.body;
  const paymentMethod = await paymentMethodUseCase.execute({ name, paymentType });
  return res.status(201).json({ ...paymentMethod });
});
app.delete('/paymentmethod/:id', authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  await paymentMethodService.delete(Number(id));
  return res.status(204).send();
});

app.get('/expense', authMiddleware, async (req: Request, res: Response) => {
  const { page, size, from, to, paymentMethodId } = req.query;
  const result = await expenseQuery.fetchAll(
    page ? Number(page) : 1,
    size ? Number(size) : 10,
    String(from),
    String(to),
    paymentMethodId ? Number(paymentMethodId) : undefined,
  );
  return res.status(200).json(result);
});

app.get('/expenses/sum', authMiddleware, async (req: Request, res: Response) => {
  const { from, to } = req.query;
  const result = await expensesService.fetchSummedExpensesGroupedByPaymentType(String(from), String(to));
  return res.status(200).json(result);
});

app.post('/expense', authMiddleware, async (req: Request, res: Response) => {
  const {
    amount,
    description,
    date: dateStr,
    categoryId,
    paymentMethodId,
    installments,
    currentInstallment,
  } = req.body;
  const expense = await createExpenseUseCase.execute({
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

app.delete('/expense/:id', authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteExpenseUseCase.execute(Number(id));
  return res.status(204).send();
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
