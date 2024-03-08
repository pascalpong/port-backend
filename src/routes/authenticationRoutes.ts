import express from 'express';
import { checkSerial, createUser, generateSerial, login } from '../controllers/authenticationController';

const router = express.Router();

router.post('/serial', checkSerial);
router.post('/serial/create', generateSerial);
router.post('/user/create', createUser);
router.post('/login', login);

export default router;