"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_expense_usecase_1 = require("../create-expense.usecase");
const faker_1 = require("@faker-js/faker");
const expense_entity_1 = __importDefault(require("../../../domain/entity/expense.entity"));
const amount = Number(faker_1.faker.finance.amount());
const description = faker_1.faker.commerce.productName();
const date = new Date();
const id = 1;
const installments = faker_1.faker.number.int({ min: 1, max: 10 });
const mockedExpenseRepository = {
    create: jest.fn(),
    delete: jest.fn()
};
describe('Create expense use case test', () => {
    const createExpenseUseCase = new create_expense_usecase_1.CreateExpenseUseCase(mockedExpenseRepository);
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('creates expense', async () => {
        mockedExpenseRepository.create.mockResolvedValueOnce(new expense_entity_1.default(amount, description, date, id, id, installments, installments, 1));
        const expenseDTO = { amount, description, date, categoryId: id, paymentMethodId: id, installments, currentInstallment: installments };
        const result = await createExpenseUseCase.execute(expenseDTO);
        expect(result).toStrictEqual(new expense_entity_1.default(amount, description, date, id, id, installments, installments, 1));
    });
    it('calls expense repository', async () => {
        mockedExpenseRepository.create.mockResolvedValueOnce(new expense_entity_1.default(amount, description, date, id, id, installments, installments, 1));
        const expenseDTO = { amount, description, date, categoryId: id, paymentMethodId: id, installments, currentInstallment: installments };
        await createExpenseUseCase.execute(expenseDTO);
        expect(mockedExpenseRepository.create).toHaveBeenCalledWith(new expense_entity_1.default(amount, description, date, id, id, installments, installments));
        expect(mockedExpenseRepository.create).toHaveBeenCalledTimes(1);
    });
});
