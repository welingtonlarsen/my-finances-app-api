"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const create_category_usecase_1 = __importDefault(require("./application/usercase/create-category.usecase"));
const category_orm_repository_1 = __importDefault(require("./infra/db/repository/category.orm.repository"));
const client_1 = require("@prisma/client");
const error_handler_1 = require("./infra/express/error-handler");
const expense_orm_repository_1 = __importDefault(require("./infra/db/repository/expense.orm.repository"));
const create_expense_usecase_1 = require("./application/usercase/create-expense.usecase");
const payment_method_orm_repository_1 = __importDefault(require("./infra/db/repository/payment-method.orm.repository"));
const create_payment_method_usecase_1 = __importDefault(require("./application/usercase/create-payment-method.usecase"));
const expense_query_1 = __importDefault(require("./query/expense.query"));
const category_query_1 = __importDefault(require("./query/category.query"));
const payment_method_query_1 = __importDefault(require("./query/payment-method.query"));
const cors_1 = __importDefault(require("cors"));
const delete_expense_usecase_1 = require("./application/usercase/delete-expense.usecase");
const port = process.env.PORT ?? 3000;
const prismaClient = new client_1.PrismaClient();
const categoryRepository = new category_orm_repository_1.default(prismaClient);
const createCategoryUseCase = new create_category_usecase_1.default(categoryRepository);
const categoryQuery = new category_query_1.default(prismaClient);
const paymentMethodRepository = new payment_method_orm_repository_1.default(prismaClient);
const paymentMethodUseCase = new create_payment_method_usecase_1.default(paymentMethodRepository);
const paymentMethodQuery = new payment_method_query_1.default(prismaClient);
const expenseRepository = new expense_orm_repository_1.default(prismaClient);
const createExpenseUseCase = new create_expense_usecase_1.CreateExpenseUseCase(expenseRepository);
const deleteExpenseUseCase = new delete_expense_usecase_1.DeleeteExpenseUseCase(expenseRepository);
const expenseQuery = new expense_query_1.default(prismaClient);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.send('health ok');
});
app.get('/category', async (req, res) => {
    const { page, size } = req.query;
    const result = await categoryQuery.fetchAll(page ? Number(page) : 1, size ? Number(size) : 10);
    return res.status(200).json(result);
});
app.post('/category', async (req, res) => {
    const { name, colorHexCode } = req.body;
    const category = await createCategoryUseCase.execute({ name, colorHexCode });
    return res.status(201).json({ ...category });
});
app.get('/paymentmethod', async (req, res) => {
    const { page, size } = req.query;
    const result = await paymentMethodQuery.fetchAll(page ? Number(page) : 1, size ? Number(size) : 10);
    return res.status(200).json(result);
});
app.post('/paymentmethod', async (req, res) => {
    const { name, paymentType } = req.body;
    const paymentMethod = await paymentMethodUseCase.execute({ name, paymentType });
    return res.status(201).json({ ...paymentMethod });
});
app.get('/expense', async (req, res) => {
    const { page, size } = req.query;
    const result = await expenseQuery.fetchAll(page ? Number(page) : 1, size ? Number(size) : 10);
    return res.status(200).json(result);
});
app.get('/expenses/sum', async (req, res) => {
    const result = await expenseQuery.fetchSummedExpensesGroupedByPaymentType();
    return res.status(200).json(result);
});
app.post('/expense', async (req, res) => {
    const { amount, description, date: dateStr, categoryId, paymentMethodId, installments, currentInstallment } = req.body;
    const expense = await createExpenseUseCase.execute({ amount, description, date: new Date(dateStr), categoryId, paymentMethodId, installments, currentInstallment });
    return res.status(201).json(expense);
});
app.delete('/expenses/:id', async (req, res) => {
    const { id } = req.params;
    await deleteExpenseUseCase.execute(Number(id));
    return res.status(204).send();
});
app.use(error_handler_1.errorHandler);
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
