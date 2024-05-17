"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ForeignKeyError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
}
exports.default = ForeignKeyError;
