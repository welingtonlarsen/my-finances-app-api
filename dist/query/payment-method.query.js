"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orm_util_1 = __importDefault(require("../infra/db/repository/orm.util"));
class PaymentMethodQuery {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async fetchAll(page = 1, size = 10) {
        if (page <= 0)
            throw new Error('Invalid page');
        const skip = (page - 1) * size;
        const paymentMethods = await this.prisma.paymentMethod.findMany({ skip, take: size });
        const hydratedPaymentMethods = paymentMethods.map(method => {
            const domainPaymentType = orm_util_1.default.parsePaymentTypeToDomain(method.paymentType);
            return {
                ...method,
                paymentType: domainPaymentType
            };
        });
        return hydratedPaymentMethods;
    }
}
exports.default = PaymentMethodQuery;
