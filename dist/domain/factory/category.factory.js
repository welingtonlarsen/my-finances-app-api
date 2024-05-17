"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_entity_1 = __importDefault(require("../entity/category.entity"));
class CategoryFactory {
    static of(categoryInputDTO) {
        return new category_entity_1.default(categoryInputDTO.name, categoryInputDTO.colorHexCode);
    }
}
exports.default = CategoryFactory;
