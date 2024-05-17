"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_factory_1 = __importDefault(require("../../domain/factory/category.factory"));
class CreateCategoryUseCase {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute(categoryDTO) {
        const categoryEntity = category_factory_1.default.of(categoryDTO);
        return this.categoryRepository.create(categoryEntity);
    }
}
exports.default = CreateCategoryUseCase;
