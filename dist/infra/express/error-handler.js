"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const existent_register_error_1 = __importDefault(require("../../application/error/existent-register.error"));
const existent_payment_method_error_1 = __importDefault(require("../../application/error/existent-payment-method.error"));
const foreign_key_error_1 = __importDefault(require("../../application/error/foreign-key.error"));
const repository_generic_error_1 = __importDefault(require("../../application/error/repository-generic.error"));
const errorHandler = (err, req, res, next) => {
    if (err instanceof existent_register_error_1.default) {
        return res.status(409).json({ message: 'Existent register.' });
    }
    if (err instanceof existent_payment_method_error_1.default) {
        return res.status(409).json({ message: 'Existent payment method.' });
    }
    if (err instanceof foreign_key_error_1.default) {
        return res.status(409).json({ message: 'Some invalid key.' });
    }
    if (err instanceof repository_generic_error_1.default) {
        return res.status(500).json({ message: 'Server error.' });
    }
    return res.status(500).json({ message: 'Server error.' });
};
exports.errorHandler = errorHandler;
