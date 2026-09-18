import authController from "../controller/authController.js";
import express from "express";


const router = express.Router();


router.post('/signup', authController.signup);
router.post('/login', authController.login);

export default router;
