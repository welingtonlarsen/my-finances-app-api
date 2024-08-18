import { type PrismaClient } from '@prisma/client';
import type CategoryQueryDTO from './dto/category.query.dto';
import { asyncLocalStorage, Context } from '../infra/context/store.context';

export default class CategoryQuery {
  @Context('userId')
  private userId?: string;

  constructor(private readonly prisma: PrismaClient) {}

  async fetchAll(page: number = 1, size: number = 10): Promise<CategoryQueryDTO[]> {
    if (page <= 0) throw new Error('Invalid page');

    if (!this.userId) throw new Error('User id were not defined');

    const skip = (page - 1) * size;
    const categories = await this.prisma.category.findMany({
      skip,
      take: size,
      where: { userId: Number(this.userId) },
    });
    return categories;
  }
}
