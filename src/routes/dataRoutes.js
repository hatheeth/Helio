import express from 'express';
import { userInfo, setAvailablity } from '../controller/dataController.js';

const router = express.Router();

router.get('/data', userInfo);
router.get('/available',setAvailablity);

export default router;
