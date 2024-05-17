"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_orm_repository_1 = __importDefault(require("../category.orm.repository"));
const category_entity_1 = __importDefault(require("../../../../domain/entity/category.entity"));
const faker_1 = require("@faker-js/faker");
const client_1 = require("@prisma/client");
const existent_register_error_1 = __importDefault(require("../../../../application/error/existent-register.error"));
const repository_generic_error_1 = __importDefault(require("../../../../application/error/repository-generic.error"));
const categoryName = faker_1.faker.finance.currencyName();
const colorHexCode = faker_1.faker.internet.color();
describe('Category ORM repository integration test', () => {
    const prismaClient = new client_1.PrismaClient();
    const categoryORMRepository = new category_orm_repository_1.default(prismaClient);
    beforeEach(async () => {
        await prismaClient.$executeRawUnsafe('TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE;');
    });
    it('creates a category', async () => {
        const categoryEntity = new category_entity_1.default(categoryName, colorHexCode);
        const result = await categoryORMRepository.create(categoryEntity);
        expect(result).toEqual(new category_entity_1.default(categoryName, colorHexCode, 1));
    });
    it('throws ExistentRegisterError when category name already exists', async () => {
        await categoryORMRepository.create(new category_entity_1.default(categoryName, colorHexCode));
        await (expect(categoryORMRepository.create(new category_entity_1.default(categoryName, colorHexCode)))).rejects
            .toStrictEqual(new existent_register_error_1.default(`Category with name ${categoryName} already exists.`));
    });
    it('throws RepositoryGenericError when some unhandled database error', async () => {
        jest.spyOn(prismaClient.category, 'create').mockRejectedValueOnce(new Error('Some unhandled database error'));
        await (expect(categoryORMRepository.create(new category_entity_1.default(categoryName, colorHexCode)))).rejects
            .toStrictEqual(new repository_generic_error_1.default(`Error trying to create the category: ${JSON.stringify({ name: categoryName, colorHexCode })}`));
    });
});
