import express from 'express';
import { createProjects, getProjects } from '../controllers/projectControllers';
import authentication from '../middlewares/authenticationMiddleware';

const router = express.Router();

router.get('/', authentication, getProjects);
router.post('/', authentication, createProjects);

export default router;