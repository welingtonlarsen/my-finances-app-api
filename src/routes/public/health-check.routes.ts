import { Router, type Request, type Response } from 'express';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.send('health ok');
});

export const healthCheckRoutes = router;
