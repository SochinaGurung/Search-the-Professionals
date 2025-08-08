import {Router} from 'express';
const router =Router();
import {register} from '../controllers/auth.controller.js';
import {login} from '../controllers/auth.controller.js';

router.post('/register', register);
router.post('/login', login);

export default router;