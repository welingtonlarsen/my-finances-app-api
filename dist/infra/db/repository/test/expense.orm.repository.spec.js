"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const expense_orm_repository_1 = __importDefault(require("../expense.orm.repository"));
const expense_entity_1 = __importDefault(require("../../../../domain/entity/expense.entity"));
const faker_1 = require("@faker-js/faker");
const foreign_key_error_1 = __importDefault(require("../../../../application/error/foreign-key.error"));
const class_transform_util_1 = __importDefault(require("../../../../application/util/class-transform.util"));
const category_orm_repository_1 = __importDefault(require("../category.orm.repository"));
const payment_method_orm_repository_1 = __importDefault(require("../payment-method.orm.repository"));
const category_entity_1 = __importDefault(require("../../../../domain/entity/category.entity"));
const payment_method_entity_1 = __importDefault(require("../../../../domain/entity/payment-method.entity"));
const payment_type_enum_1 = require("../../../../application/enum/payment-type.enum");
const repository_generic_error_1 = __importDefault(require("../../../../application/error/repository-generic.error"));
const amount = Number(faker_1.faker.finance.amount());
const description = faker_1.faker.commerce.productName();
const date = new Date();
const id = 1;
const installment = faker_1.faker.number.int({ min: 1, max: 10 });
describe('Expense repository ORM test', () => {
    const prismaClient = new client_1.PrismaClient();
    const expenseRepository = new expense_orm_repository_1.default(prismaClient);
    const categoryRepository = new category_orm_repository_1.default(prismaClient);
    const paymentMethodRepository = new payment_method_orm_repository_1.default(prismaClient);
    beforeEach(async () => {
        await prismaClient.$executeRawUnsafe('TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE;');
        await prismaClient.$executeRawUnsafe('TRUNCATE TABLE "PaymentMethod" RESTART IDENTITY CASCADE;');
        await prismaClient.$executeRawUnsafe('TRUNCATE TABLE "Expense" RESTART IDENTITY CASCADE;');
    });
    describe('create', () => {
        it('creates expense', async () => {
            // Setup category
            const categoryName = faker_1.faker.finance.currencyName();
            const colorHexCode = faker_1.faker.internet.color();
            await prismaClient.$executeRawUnsafe('TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE;');
            await categoryRepository.create(new category_entity_1.default(categoryName, colorHexCode));
            // Setup payment method
            const paymentMethodName = faker_1.faker.finance.currencyName();
            await prismaClient.$executeRawUnsafe('TRUNCATE TABLE "PaymentMethod" RESTART IDENTITY CASCADE;');
            await paymentMethodRepository.create(new payment_method_entity_1.default(paymentMethodName, payment_type_enum_1.PaymentType.PIX));
            const expenseEntity = new expense_entity_1.default(amount, description, date, id, id, installment, installment);
            const result = await expenseRepository.create(expenseEntity);
            expect(result).toStrictEqual(new expense_entity_1.default(amount, description, date, id, id, installment, installment, 1));
        });
        it('throws ForeignKeyError when relation is invalid', async () => {
            const expenseEntity = new expense_entity_1.default(amount, description, date, id, id, installment, installment);
            await (expect(expenseRepository.create(expenseEntity))).rejects
                .toStrictEqual(new foreign_key_error_1.default(`Foreign key error on expense "${class_transform_util_1.default.classToStringPlain(expenseEntity)}".`));
        });
        it('throws RepositoryGenericError when some unhandled database error', async () => {
            jest.spyOn(prismaClient.expense, 'create').mockRejectedValueOnce(new Error('Some unhandled database error'));
            const expenseEntity = new expense_entity_1.default(amount, description, date, id, id, installment, installment);
            await (expect(expenseRepository.create(expenseEntity))).rejects
                .toStrictEqual(new repository_generic_error_1.default(`Error trying to persist expense "${class_transform_util_1.default.classToStringPlain(expenseEntity)}".`));
        });
    });
});
