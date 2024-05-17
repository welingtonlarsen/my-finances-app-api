"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RepositoryGenericError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
}
exports.default = RepositoryGenericError;
