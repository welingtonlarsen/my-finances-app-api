import { type PrismaClient } from '@prisma/client'
import type CategoryQueryDTO from './dto/category.query.dto'

export default class CategoryQuery {
  constructor (private readonly prisma: PrismaClient) {}

  async fetchAll (page: number = 1, size: number = 10): Promise<CategoryQueryDTO[]> {
    if (page <= 0) throw new Error('Invalid page')
    const skip = (page - 1) * size
    const categories = await this.prisma.category.findMany({ skip, take: size })
    return categories
  }
}
