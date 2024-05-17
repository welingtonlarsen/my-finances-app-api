"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateExpenseUseCase = void 0;
const expense_factory_1 = __importDefault(require("../../domain/factory/expense.factory"));
class CreateExpenseUseCase {
    constructor(expenseRepository) {
        this.expenseRepository = expenseRepository;
    }
    async execute(expenseDTO) {
        const expenseEntity = expense_factory_1.default.of(expenseDTO);
        return this.expenseRepository.create(expenseEntity);
    }
}
exports.CreateExpenseUseCase = CreateExpenseUseCase;
