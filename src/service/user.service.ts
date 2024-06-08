import { hash } from 'bcryptjs'
import { type PrismaClient } from '@prisma/client'
import ExistentRegisterError from '../application/error/existent-register.error'

interface UserPayload {
  name: string
  email: string
  password: string
}

interface UserResponse {
  id: number
  name: string
  email: string
}

export default class UserService {
  constructor (private readonly prisma: PrismaClient) {}

  async createUser (userPayload: UserPayload): Promise<UserResponse> {
    const { name, email, password } = userPayload

    const userExists = await this.prisma.user.findUnique({ where: { email } })

    if (userExists) {
      throw new ExistentRegisterError('User already exists.')
    }

    const hashPassword = await hash(password, 8)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...persistedUser } = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword
      }
    })

    return persistedUser
  }
}
