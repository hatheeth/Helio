import { createChat } from "../controller/chatRoomCreateController.js";
import express from "express";

const router = express.Router();

router.post('/create', createChat);

export default router;