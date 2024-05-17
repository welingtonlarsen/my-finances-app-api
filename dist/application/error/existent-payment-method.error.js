"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExistentPaymentMethodError extends Error {
    constructor(message) {
        super();
        this.message = message;
        this.name = 'ExistentPaymentMethodError';
    }
}
exports.default = ExistentPaymentMethodError;
