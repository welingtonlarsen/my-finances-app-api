import CategoryEntity from '../entity/category.entity'
import type CategoryInputDTO from '../dto/category.input-dto'
export default class CategoryFactory {
  public static of (categoryInputDTO: CategoryInputDTO): CategoryEntity {
    return new CategoryEntity(categoryInputDTO.name, categoryInputDTO.colorHexCode)
  }
}
