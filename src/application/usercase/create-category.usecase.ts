import CategoryFactory from '../../domain/factory/category.factory';
import type CategoryRepository from '../repository/category.repository';
import type CategoryInputDTO from '../../domain/dto/category.input-dto';
import type CategoryEntity from '../../domain/entity/category.entity';

export default class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(categoryDTO: CategoryInputDTO): Promise<CategoryEntity> {
    const categoryEntity = CategoryFactory.of(categoryDTO);
    return this.categoryRepository.create(categoryEntity);
  }
}
