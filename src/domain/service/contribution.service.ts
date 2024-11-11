import { PrismaClient } from '@prisma/client';
import { Context } from '../../infra/context/store.context';
import ContributionInputDTO from '../dto/contribution.input.dto';
import RepositoryGenericError from '../../application/error/repository-generic.error';
import ClassTransformUtil from '../../application/util/class-transform.util';
import ContributionOutputDTO from '../dto/contribution.output.dto';
import { convertToDate } from '../../application/util/date.utils';

export default class ContributionService {
  @Context('userId')
  private userId?: string;

  constructor(private readonly prismaClient: PrismaClient) {}

  async createContribution(contribution: ContributionInputDTO): Promise<ContributionOutputDTO> {
    const date = convertToDate(contribution.month, contribution.year);
    try {
      const result = await this.prismaClient.contribution.create({
        data: {
          date: convertToDate(contribution.month, contribution.year),
          amount: contribution.amount,
          userId: Number(this.userId),
        },
      });
      return {
        id: result.id,
        amount: result.amount,
        date: result.date,
        userId: result.userId,
      };
    } catch (e) {
      throw new RepositoryGenericError(
        `Error trying to persist contribution "${ClassTransformUtil.classToStringPlain(contribution)}".`,
      );
    }
  }
}
