import 'express-async-errors';
import express, { type Request, type Response } from 'express';
import { errorHandler } from './infra/express/error-handler';
import cors from 'cors';
import morgan from 'morgan';
import { storeStarterMiddleware } from './infra/express/storage-starter.middleware';
import { userRoutes } from './routes/public/user.routes';
import { categoryRoutes } from './routes/private/category.routes';
import { healthCheckRoutes } from './routes/public/health-check.routes';
import { expenseRoutes } from './routes/private/expense.routes';
import { paymentMethodRoutes } from './routes/private/payment-method.routes';
import { contributionRoutes } from './routes/private/contribution.routes';
import { retirementPlanRoutes } from './routes/private/retirement-plan.routes';

const port = process.env.PORT ?? 3000;

// App instance
const app = express();

// General configs
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.use(storeStarterMiddleware);

// Routes
app.use(healthCheckRoutes);
app.use(userRoutes);
app.use(categoryRoutes);
app.use(expenseRoutes);
app.use(paymentMethodRoutes);
app.use(contributionRoutes);
app.use(retirementPlanRoutes);

// Error handler
app.use(errorHandler);

// Start http server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

export { app };
