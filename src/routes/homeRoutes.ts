import express from 'express';
import { homeController, homeTest } from '../controllers/homeController';

const router = express.Router();

router.get('/', homeController);
router.get('/test', homeTest);

export default router;