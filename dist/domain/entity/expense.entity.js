"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExpenseEntity {
    constructor(amount, description, date, categoryId, paymentMethodId, installments, currentInstallment, id) {
        this.amount = amount;
        this.description = description;
        this.date = date;
        this.categoryId = categoryId;
        this.paymentMethodId = paymentMethodId;
        this.installments = installments;
        this.currentInstallment = currentInstallment;
        this.id = id;
    }
}
exports.default = ExpenseEntity;
