"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const payment_type_enum_1 = require("../../../application/enum/payment-type.enum");
const repository_generic_error_1 = __importDefault(require("../../../application/error/repository-generic.error"));
class ORMUtil {
    static parsePaymentTypeToDomain(ormPaymentType) {
        const paymentTypeDictionary = new Map([
            [client_1.$Enums.PaymentType.CREDIT_CARD, payment_type_enum_1.PaymentType.CREDIT_CARD],
            [client_1.$Enums.PaymentType.PIX, payment_type_enum_1.PaymentType.PIX],
            [client_1.$Enums.PaymentType.TED, payment_type_enum_1.PaymentType.TED],
            [client_1.$Enums.PaymentType.CASH, payment_type_enum_1.PaymentType.CASH],
            [client_1.$Enums.PaymentType.DEBIT_CARD, payment_type_enum_1.PaymentType.DEBIT_CARD]
        ]);
        const domainPaymentType = paymentTypeDictionary.get(ormPaymentType);
        if (!domainPaymentType)
            throw new repository_generic_error_1.default(`Payment type "${ormPaymentType}" of db does not match domain.`);
        return domainPaymentType;
    }
}
exports.default = ORMUtil;
