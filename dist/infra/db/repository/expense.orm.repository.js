"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expense_entity_1 = __importDefault(require("../../../domain/entity/expense.entity"));
const foreign_key_error_1 = __importDefault(require("../../../application/error/foreign-key.error"));
const class_transform_util_1 = __importDefault(require("../../../application/util/class-transform.util"));
const library_1 = require("@prisma/client/runtime/library");
const repository_generic_error_1 = __importDefault(require("../../../application/error/repository-generic.error"));
class ExpenseORMRepository {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    async create(expenseEntity) {
        try {
            const { id, amount, description, date, categoryId, paymentMethodId, installments, currentInstallment } = await this.prismaClient.expense.create({
                data: expenseEntity
            });
            // TODO: Handle in factory
            return new expense_entity_1.default(amount, description, date, categoryId, paymentMethodId, installments, currentInstallment, id);
        }
        catch (err) {
            if (err instanceof library_1.PrismaClientKnownRequestError && err.code === 'P2003') {
                throw new foreign_key_error_1.default(`Foreign key error on expense "${class_transform_util_1.default.classToStringPlain(expenseEntity)}".`);
            }
            throw new repository_generic_error_1.default(`Error trying to persist expense "${class_transform_util_1.default.classToStringPlain(expenseEntity)}".`);
        }
    }
    async delete(expenseId) {
        try {
            await this.prismaClient.expense.delete({
                where: {
                    id: expenseId
                }
            });
        }
        catch (err) {
            throw new repository_generic_error_1.default(`Error trying to delete expense "${expenseId}".`);
        }
    }
}
exports.default = ExpenseORMRepository;
