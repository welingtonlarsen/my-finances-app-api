import CategoryOrmRepository from '../category.orm.repository'
import CategoryEntity from '../../../../domain/entity/category.entity'
import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import ExistentRegisterError from '../../../../application/error/existent-register.error'
import RepositoryGenericError from '../../../../application/error/repository-generic.error'

const categoryName = faker.finance.currencyName()
const colorHexCode = faker.internet.color()
describe('Category ORM repository integration test', () => {
  const prismaClient = new PrismaClient()
  const categoryORMRepository = new CategoryOrmRepository(prismaClient)

  beforeEach(async () => {
    await prismaClient.$executeRawUnsafe('TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE;')
  })

  it('creates a category', async () => {
    const categoryEntity = new CategoryEntity(categoryName, colorHexCode)
    const result = await categoryORMRepository.create(categoryEntity)
    expect(result).toEqual(new CategoryEntity(categoryName, colorHexCode, 1))
  })

  it('throws ExistentRegisterError when category name already exists', async () => {
    await categoryORMRepository.create(new CategoryEntity(categoryName, colorHexCode))
    await (expect(categoryORMRepository.create(new CategoryEntity(categoryName, colorHexCode)))).rejects
      .toStrictEqual(new ExistentRegisterError(`Category with name ${categoryName} already exists.`))
  })

  it('throws RepositoryGenericError when some unhandled database error', async () => {
    jest.spyOn(prismaClient.category, 'create').mockRejectedValueOnce(new Error('Some unhandled database error'))
    await (expect(categoryORMRepository.create(new CategoryEntity(categoryName, colorHexCode)))).rejects
      .toStrictEqual(new RepositoryGenericError(`Error trying to create the category: ${JSON.stringify({ name: categoryName, colorHexCode })}`))
  })
})
