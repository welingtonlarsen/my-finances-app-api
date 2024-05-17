import type CategoryEntity from '../../domain/entity/category.entity'

export default interface CategoryRepository {
  create: (categoryEntity: CategoryEntity) => Promise<CategoryEntity>
}
