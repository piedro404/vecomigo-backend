import { home } from '@controllers/app.controller.js';
import { Router } from 'express';

const router = Router();

router.get('/', home);

export default router;
