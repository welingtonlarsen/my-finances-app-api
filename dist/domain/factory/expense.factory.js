"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expense_entity_1 = __importDefault(require("../entity/expense.entity"));
class ExpenseFactory {
    static of(expenseDTO) {
        return new expense_entity_1.default(expenseDTO.amount, expenseDTO.description, expenseDTO.date, expenseDTO.categoryId, expenseDTO.paymentMethodId, expenseDTO.installments, expenseDTO.currentInstallment);
    }
}
exports.default = ExpenseFactory;
