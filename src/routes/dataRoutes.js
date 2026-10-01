import express from 'express';
import { userInfo } from '../controller/dataController.js';

const router = express.Router();

router.get('/data', userInfo);


export default router;
