import express from 'express';
import { userInfo, updateUser } from '../controller/dataController.js';

const router = express.Router();

router.get('/data', userInfo);
router.post('/updateUser',updateUser);

export default router;
