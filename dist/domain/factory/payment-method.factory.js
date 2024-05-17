"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const payment_method_entity_1 = __importDefault(require("../entity/payment-method.entity"));
class PaymentMethodFactory {
    static of(paymentMethodDTO) {
        return new payment_method_entity_1.default(paymentMethodDTO.name, paymentMethodDTO.paymentType);
    }
}
exports.default = PaymentMethodFactory;
