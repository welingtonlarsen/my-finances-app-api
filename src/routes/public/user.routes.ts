import { Router, type Request, type Response } from 'express';
import AuthService from '../../domain/service/auth.service';
import UserService from '../../domain/service/user.service';
import { getPrismaClient } from '../../infra/db/prisma.instance';

const prismaClient = getPrismaClient();

const userService = new UserService(prismaClient);
const authService = new AuthService(prismaClient);

const router = Router();

router.post('/users', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await userService.createUser({ name, email, password });
  return res.status(201).json(user);
});

router.post('/users/authenticate', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userDetails = await authService.authenticate({ email, password });
  return res.status(200).json(userDetails);
});

export const userRoutes = router;
