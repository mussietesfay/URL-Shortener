
import express from 'express'

const router = express.Router();

import {register , login , checkUser} from '../../controllers/userController/userContoller.js'
import {authMiddle} from '../../middleware/userMiddleware.js'

router.post('/v1/register' , register);

router.post('/v1/login' , login);

router.get('/v1/usercheck', authMiddle, checkUser)


export default router;