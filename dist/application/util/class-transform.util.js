"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClassTransformUtil {
    static classToStringPlain(instance) {
        return JSON.stringify({ ...instance });
    }
}
exports.default = ClassTransformUtil;
