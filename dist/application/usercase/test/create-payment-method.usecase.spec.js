"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_payment_method_usecase_1 = __importDefault(require("../create-payment-method.usecase"));
const payment_method_entity_1 = __importDefault(require("../../../domain/entity/payment-method.entity"));
const payment_type_enum_1 = require("../../enum/payment-type.enum");
const existent_payment_method_error_1 = __importDefault(require("../../error/existent-payment-method.error"));
const name = 'Nubank credit card';
const paymentType = payment_type_enum_1.PaymentType.CREDIT_CARD;
const mockedPaymentMethodRepository = {
    create: jest.fn(),
    getByName: jest.fn()
};
describe('Create payment method use case test', () => {
    const createPaymentMethodUseCase = new create_payment_method_usecase_1.default(mockedPaymentMethodRepository);
    it('creates payment method', async () => {
        mockedPaymentMethodRepository.getByName.mockResolvedValueOnce(null);
        mockedPaymentMethodRepository.create.mockResolvedValueOnce(new payment_method_entity_1.default(name, paymentType));
        const result = await createPaymentMethodUseCase.execute({ name, paymentType });
        expect(result).toStrictEqual(new payment_method_entity_1.default(name, paymentType));
    });
    it('throws ExistentPaymentMethodError when name of payment method already exists', async () => {
        mockedPaymentMethodRepository.getByName.mockResolvedValueOnce(new payment_method_entity_1.default(name, paymentType));
        await expect(createPaymentMethodUseCase.execute({ name, paymentType }))
            .rejects.toStrictEqual(new existent_payment_method_error_1.default(`Payment method with name "${name}" already exists.`));
    });
});
