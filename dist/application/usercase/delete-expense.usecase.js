"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleeteExpenseUseCase = void 0;
class DeleeteExpenseUseCase {
    constructor(expenseRepository) {
        this.expenseRepository = expenseRepository;
    }
    async execute(expenseId) {
        await this.expenseRepository.delete(expenseId);
    }
}
exports.DeleeteExpenseUseCase = DeleeteExpenseUseCase;
