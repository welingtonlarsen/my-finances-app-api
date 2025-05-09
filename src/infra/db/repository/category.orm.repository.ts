import type CategoryRepository from '../../../application/repository/category.repository';
import CategoryEntity from '../../../domain/entity/category.entity';
import { type PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import ExistentRegisterError from '../../../application/error/existent-register.error';
import RepositoryGenericError from '../../../application/error/repository-generic.error';
import ClassTransformUtil from '../../../application/util/class-transform.util';
import { Context } from '../../context/store.context';

export default class CategoryOrmRepository implements CategoryRepository {
  @Context('userId')
  private userId?: string;

  constructor(private readonly prismaClient: PrismaClient) {}

  async create(categoryEntity: CategoryEntity): Promise<CategoryEntity> {
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
