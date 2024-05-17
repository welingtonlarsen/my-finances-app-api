"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const existent_payment_method_error_1 = __importDefault(require("../error/existent-payment-method.error"));
const payment_method_factory_1 = __importDefault(require("../../domain/factory/payment-method.factory"));
class CreatePaymentMethodUseCase {
    constructor(paymentMethodRepository) {
        this.paymentMethodRepository = paymentMethodRepository;
    }
    async execute(paymentMethodDTO) {
        await this.verifyIfPaymentMethodExists(paymentMethodDTO.name);
        const paymentMethodEntity = payment_method_factory_1.default.of(paymentMethodDTO);
        return this.paymentMethodRepository.create(paymentMethodEntity);
    }
    async verifyIfPaymentMethodExists(paymentMethodName) {
        const existentPaymentMethod = await this.paymentMethodRepository.getByName(paymentMethodName);
        if (existentPaymentMethod !== null) {
            throw new existent_payment_method_error_1.default(`Payment method with name "${paymentMethodName}" already exists.`);
        }
    }
}
exports.default = CreatePaymentMethodUseCase;
