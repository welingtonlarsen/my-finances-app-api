import type CategoryRepository from '../../repository/category.repository'
import CategoryEntity from '../../../domain/entity/category.entity'
import CreateCategoryUseCase from '../create-category.usecase'
import { faker } from '@faker-js/faker'

const name = faker.color.human()
const colorHexCode = faker.internet.color()
const id = faker.number.int(100)

const mockedCategoryRepository: jest.Mocked<CategoryRepository> = {
  create: jest.fn()
}

describe('Create category use case test', () => {
  const createCategoryUseCase = new CreateCategoryUseCase(mockedCategoryRepository)

  it('creates category', async () => {
    mockedCategoryRepository.create.mockResolvedValueOnce(new CategoryEntity(name, colorHexCode, id))
    const result = await createCategoryUseCase.execute({ name, colorHexCode })
    expect(result).toEqual(new CategoryEntity(name, colorHexCode, id))
  })
})
