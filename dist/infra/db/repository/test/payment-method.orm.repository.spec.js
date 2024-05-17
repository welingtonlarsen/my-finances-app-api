"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const payment_method_orm_repository_1 = __importDefault(require("../payment-method.orm.repository"));
const payment_method_entity_1 = __importDefault(require("../../../../domain/entity/payment-method.entity"));
const payment_type_enum_1 = require("../../../../application/enum/payment-type.enum");
const faker_1 = require("@faker-js/faker");
const repository_generic_error_1 = __importDefault(require("../../../../application/error/repository-generic.error"));
const existent_register_error_1 = __importDefault(require("../../../../application/error/existent-register.error"));
const paymentMethodName = faker_1.faker.finance.currencyName();
const paymentMethodEntity = new payment_method_entity_1.default(paymentMethodName, payment_type_enum_1.PaymentType.PIX);
describe('Payment method ORM repository integration test', () => {
    const prismaClient = new client_1.PrismaClient();
    const paymentMethodORMRepository = new payment_method_orm_repository_1.default(prismaClient);
    beforeEach(async () => {
        await prismaClient.$executeRawUnsafe('TRUNCATE TABLE "PaymentMethod" RESTART IDENTITY CASCADE;');
    });
    describe('create', () => {
        it('creates a payment method', async () => {
            const result = await paymentMethodORMRepository.create(paymentMethodEntity);
            expect(result).toEqual(new payment_method_entity_1.default(paymentMethodName, payment_type_enum_1.PaymentType.PIX, 1));
        });
        it('throws RepositoryGenericError when payment type of db does not match domain', async () => {
            const mockedResponse = { paymentType: 'any-payment-type' };
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            jest.spyOn(prismaClient.paymentMethod, 'create').mockResolvedValueOnce(mockedResponse);
            await (expect(paymentMethodORMRepository.create(paymentMethodEntity))).rejects
                .toStrictEqual(new repository_generic_error_1.default('Payment type "any-payment-type" of db does not match domain.'));
        });
        it('throws ExistentRegisterError when payment method name already exists', async () => {
            await paymentMethodORMRepository.create(paymentMethodEntity);
            await (expect(paymentMethodORMRepository.create(new payment_method_entity_1.default(paymentMethodName, payment_type_enum_1.PaymentType.PIX)))).rejects
                .toStrictEqual(new existent_register_error_1.default(`Payment with name ${paymentMethodName} already exists.`));
        });
        it('throws RepositoryGenericError when some unhandled database error', async () => {
            jest.spyOn(prismaClient.paymentMethod, 'create').mockRejectedValueOnce(new Error('Some unhandled database error'));
            await (expect(paymentMethodORMRepository.create(new payment_method_entity_1.default(paymentMethodName, payment_type_enum_1.PaymentType.PIX)))).rejects
                .toStrictEqual(new repository_generic_error_1.default(`Error trying to create the payment method: ${JSON.stringify({ name: paymentMethodName, paymentType: payment_type_enum_1.PaymentType.PIX })}`));
        });
    });
    describe('getByName', () => {
        it('fetches a persisted payment method', async () => {
            await paymentMethodORMRepository.create(paymentMethodEntity);
            const result = await paymentMethodORMRepository.getByName(paymentMethodName);
            expect(result).toEqual(new payment_method_entity_1.default(paymentMethodName, payment_type_enum_1.PaymentType.PIX, 1));
        });
        it('fetches a not persisted payment method', async () => {
            const result = await paymentMethodORMRepository.getByName(paymentMethodName);
            expect(result).toEqual(null);
        });
        it('throws RepositoryGenericError when payment type of db does not match domain', async () => {
            const mockedResponse = { paymentType: 'any-payment-type' };
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            jest.spyOn(prismaClient.paymentMethod, 'findFirst').mockResolvedValueOnce(mockedResponse);
            await (expect(paymentMethodORMRepository.getByName(paymentMethodName))).rejects
                .toStrictEqual(new repository_generic_error_1.default('Payment type "any-payment-type" of db does not match domain.'));
        });
        it('throws RepositoryGenericError when some unhandled database error', async () => {
            jest.spyOn(prismaClient.paymentMethod, 'findFirst').mockRejectedValueOnce(new Error('Some unhandled database error'));
            await (expect(paymentMethodORMRepository.getByName(paymentMethodName))).rejects
                .toStrictEqual(new repository_generic_error_1.default(`Error trying to get payment method by name ${paymentMethodName}`));
        });
    });
});
