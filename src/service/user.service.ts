import { hash } from 'bcryptjs';
import { type PrismaClient } from '@prisma/client';
import ExistentRegisterError from '../application/error/existent-register.error';

interface UserPayload {
  name: string;
  email: string;
  password: string;
}

interface UserResponse {
  id: number;
  name: string;
  email: string;
}

export default class UserService {
  constructor(private readonly prisma: PrismaClient) {}

  async createUser(userPayload: UserPayload): Promise<UserResponse> {
    const { name, email, password } = userPayload;

    const userExists = await this.prisma.user.findUnique({ where: { email } });

    if (userExists) {
      throw new ExistentRegisterError('User already exists.');
    }

    const hashPassword = await hash(password, 8);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...persistedUser } = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });

    await this.createInitialData(persistedUser.id);

    return persistedUser;
  }

  private async createInitialData(userId: number): Promise<void> {
    await this.prisma.$queryRaw`
      INSERT INTO "Category" ("name", "colorHexCode", "userId") VALUES
      ('Alimentação', '#FF5733', ${userId}),
      ('Despesas Pessoais', '#FF5733', ${userId}),
      ('Transporte', '#33FF57', ${userId}),
      ('Moradia', '#FF5733', ${userId}),
      ('Roupas', '#FFD700', ${userId}),
      ('Atividade física', '#3357FF', ${userId}),
      ('Lazer', '#33FF57', ${userId}),
      ('Educação', '#33FFF6', ${userId}),
      ('Despesas Médicas', '#FF33A1', ${userId}),
      ('Presentes e Doações', '#3357FF', ${userId}),
      ('Outros', '#808080', ${userId});
    `;

    await this.prisma.$queryRaw`
      INSERT INTO "PaymentMethod" ("name", "paymentType", "userId") VALUES
      ('Crédito Itaú', 'CREDIT_CARD', ${userId}),
      ('Débito Nubank', 'DEBIT_CARD', ${userId}),
      ('PIX Itaú', 'PIX', ${userId});
    `;
  }
}
