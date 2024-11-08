import { type PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import UserUnauthorized from '../../application/error/user-unauthorized';

interface AuthRequest {
  email: string;
  password: string;
}

export default class AuthService {
  constructor(private readonly prisma: PrismaClient) {}

  async authenticate({ email, password }: AuthRequest) {
    const user: { id: number; email: string; password: string } | null = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UserUnauthorized('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) throw new UserUnauthorized('Invalid credentials');

    const token = sign({ sub: { id: user.id, email: user.email } }, 'secret', { expiresIn: '1d' });

    return { token };
  }
}
