import { Router, type Request, type Response } from 'express';
import { authMiddleware } from '../../infra/express/auth.middleware';
import { getPrismaClient } from '../../infra/db/prisma.instance';
import CategoryQuery from '../../query/category.query';
import CategoryService from '../../domain/service/category.service';

const router = Router();
const prismaClient = getPrismaClient();

const categoryService = new CategoryService(prismaClient);
const categoryQuery = new CategoryQuery(prismaClient);

router.get('/category', authMiddleware, async (req: Request, res: Response) => {
  const { page, size } = req.query;
  const result = await categoryQuery.fetchAll(page ? Number(page) : 1, size ? Number(size) : 10);
  return res.status(200).json(result);
});

router.post('/category', authMiddleware, async (req: Request, res: Response) => {
  const { name, colorHexCode } = req.body;
  const category = await categoryService.createCategory({ name, colorHexCode });
  return res.status(201).json({ ...category });
});

export const categoryRoutes = router;
