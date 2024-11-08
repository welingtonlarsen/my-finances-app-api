import { PrismaClient } from '@prisma/client';
import CategoryInputDTO from '../domain/dto/category.input-dto';
import CategoryEntity from '../domain/entity/category.entity';
import CategoryFactory from '../domain/factory/category.factory';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import ExistentRegisterError from '../application/error/existent-register.error';
import RepositoryGenericError from '../application/error/repository-generic.error';
import ClassTransformUtil from '../application/util/class-transform.util';
import { Context } from '../infra/context/store.context';

export default class CategoryService {
  @Context('userId')
  private userId?: string;

  constructor(private readonly prismaClient: PrismaClient) {}

  async createCategory(categoryDTO: CategoryInputDTO): Promise<CategoryEntity> {
    const categoryEntity = CategoryFactory.of(categoryDTO);

    try {
      const ormCategory = await this.prismaClient.category.create({
        data: {
          name: categoryEntity.name,
          colorHexCode: categoryEntity.colorHexCode,
          userId: Number(this.userId),
        },
      });
      // TODO: Handle in factory
      return new CategoryEntity(ormCategory.name, ormCategory.colorHexCode, ormCategory.id);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ExistentRegisterError(`Category with name ${categoryEntity.name} already exists.`);
      }
      throw new RepositoryGenericError(
        `Error trying to create the category: ${ClassTransformUtil.classToStringPlain(categoryEntity)}`,
      );
    }
  }
}
