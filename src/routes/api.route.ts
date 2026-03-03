import { home } from '@controllers/app.controller';
import { Router } from 'express';

const router = Router();

router.get('/', home);

export default router;
