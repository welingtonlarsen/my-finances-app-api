import { Router, type Request, type Response } from 'express';
import { getPrismaClient } from '../../infra/db/prisma.instance';
import ContributionService from '../../domain/service/contribution.service';
import { authMiddleware } from '../../infra/express/auth.middleware';

const router = Router();
const prismaClient = getPrismaClient();

const contributionService = new ContributionService(prismaClient);

router.post('/contributions', authMiddleware, async (req: Request, res: Response) => {
  const result = await contributionService.createContribution(req.body);
  return res.status(201).json(result);
});

export const contributionRoutes = router;
