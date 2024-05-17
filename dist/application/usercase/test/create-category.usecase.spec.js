"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_entity_1 = __importDefault(require("../../../domain/entity/category.entity"));
const create_category_usecase_1 = __importDefault(require("../create-category.usecase"));
const faker_1 = require("@faker-js/faker");
const name = faker_1.faker.color.human();
const colorHexCode = faker_1.faker.internet.color();
const id = faker_1.faker.number.int(100);
const mockedCategoryRepository = {
    create: jest.fn()
};
describe('Create category use case test', () => {
    const createCategoryUseCase = new create_category_usecase_1.default(mockedCategoryRepository);
    it('creates category', async () => {
        mockedCategoryRepository.create.mockResolvedValueOnce(new category_entity_1.default(name, colorHexCode, id));
        const result = await createCategoryUseCase.execute({ name, colorHexCode });
        expect(result).toEqual(new category_entity_1.default(name, colorHexCode, id));
    });
});
