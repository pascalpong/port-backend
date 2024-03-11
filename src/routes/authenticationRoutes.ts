import express from 'express';
import { checkSerial, createUser, generateSerial, login } from '../controllers/authenticationController';
import authentication from '../middlewares/authenticationMiddleware';

const router = express.Router();

router.post('/serial', checkSerial);
router.post('/serial/create', authentication, generateSerial);
router.post('/user/create', authentication, createUser);
router.post('/login', login);

export default router;