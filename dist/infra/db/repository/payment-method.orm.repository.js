"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const payment_method_entity_1 = __importDefault(require("../../../domain/entity/payment-method.entity"));
const repository_generic_error_1 = __importDefault(require("../../../application/error/repository-generic.error"));
const class_transform_util_1 = __importDefault(require("../../../application/util/class-transform.util"));
const library_1 = require("@prisma/client/runtime/library");
const existent_register_error_1 = __importDefault(require("../../../application/error/existent-register.error"));
const orm_util_1 = __importDefault(require("./orm.util"));
class PaymentMethodORMRepository {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    async create(paymentMethodEntity) {
        try {
            const ormPaymentMethod = await this.prismaClient.paymentMethod.create({
                data: {
                    name: paymentMethodEntity.name,
                    paymentType: paymentMethodEntity.paymentType
                }
            });
            const domainPaymentType = orm_util_1.default.parsePaymentTypeToDomain(ormPaymentMethod.paymentType);
            // TODO: Handle in factory
            return new payment_method_entity_1.default(ormPaymentMethod.name, domainPaymentType, ormPaymentMethod.id);
        }
        catch (err) {
            if (err instanceof library_1.PrismaClientKnownRequestError && err.code === 'P2002')
                throw new existent_register_error_1.default(`Payment with name ${paymentMethodEntity.name} already exists.`);
            if (err instanceof repository_generic_error_1.default)
                throw err;
            throw new repository_generic_error_1.default(`Error trying to create the payment method: ${class_transform_util_1.default.classToStringPlain(paymentMethodEntity)}`);
        }
    }
    async getByName(name) {
        try {
            const ormPaymentMethod = await this.prismaClient.paymentMethod.findFirst({ where: { name } });
            if (!ormPaymentMethod)
                return null;
            const domainPaymentType = orm_util_1.default.parsePaymentTypeToDomain(ormPaymentMethod.paymentType);
            return new payment_method_entity_1.default(ormPaymentMethod.name, domainPaymentType, ormPaymentMethod.id);
        }
        catch (err) {
            if (err instanceof repository_generic_error_1.default)
                throw err;
            throw new repository_generic_error_1.default(`Error trying to get payment method by name ${name}`);
        }
    }
}
exports.default = PaymentMethodORMRepository;
