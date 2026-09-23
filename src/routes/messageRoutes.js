import { sendMessage } from "../controller/messageSendController.js";
import express from "express";

const router = express.Router();

router.post('/send', sendMessage);

export default router;