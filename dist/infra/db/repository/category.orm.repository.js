"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_entity_1 = __importDefault(require("../../../domain/entity/category.entity"));
const library_1 = require("@prisma/client/runtime/library");
const existent_register_error_1 = __importDefault(require("../../../application/error/existent-register.error"));
const repository_generic_error_1 = __importDefault(require("../../../application/error/repository-generic.error"));
const class_transform_util_1 = __importDefault(require("../../../application/util/class-transform.util"));
class CategoryOrmRepository {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    async create(categoryEntity) {
        try {
            const ormCategory = await this.prismaClient.category.create({
                data: {
                    name: categoryEntity.name,
                    colorHexCode: categoryEntity.colorHexCode
                }
            });
            // TODO: Handle in factory
            return new category_entity_1.default(ormCategory.name, ormCategory.colorHexCode, ormCategory.id);
        }
        catch (err) {
            if (err instanceof library_1.PrismaClientKnownRequestError && err.code === 'P2002') {
                throw new existent_register_error_1.default(`Category with name ${categoryEntity.name} already exists.`);
            }
            throw new repository_generic_error_1.default(`Error trying to create the category: ${class_transform_util_1.default.classToStringPlain(categoryEntity)}`);
        }
    }
}
exports.default = CategoryOrmRepository;
