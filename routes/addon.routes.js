import { Router } from 'express';
import { listAddons } from '../controllers/addon.controller.js';

const router = Router();
router.get('/', listAddons);

export default router;
