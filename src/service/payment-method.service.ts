import type { PrismaClient } from '@prisma/client'

export class PaymentMethodService {
  constructor (private readonly prisma: PrismaClient) {}

  async delete (id: number): Promise<void> {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.expense.deleteMany({
        where: {
          paymentMethodId: id
        }
      })

      await prisma.paymentMethod.delete({
        where: {
          id
        }
      })
    })
  }
}
