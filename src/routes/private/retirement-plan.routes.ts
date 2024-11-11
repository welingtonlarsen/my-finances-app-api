import { Router, type Request, type Response } from 'express';
import { authMiddleware } from '../../infra/express/auth.middleware';
import { getPrismaClient } from '../../infra/db/prisma.instance';
import { RetirementPlanService } from '../../domain/service/retirement-plan.service';

const router = Router();
const prismaClient = getPrismaClient();

const retirementPlanService = new RetirementPlanService(prismaClient);

router.post('/retirementplans', authMiddleware, async (req: Request, res: Response) => {
  const result = await retirementPlanService.createRetirementPlan(req.body);
  return res.status(201).json(result);
})

export const retirementPlanRoutes = router;