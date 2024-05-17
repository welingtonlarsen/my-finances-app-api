"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExistentRegisterError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
}
exports.default = ExistentRegisterError;
