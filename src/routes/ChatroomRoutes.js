import {chatroomList} from "../controller/fetchChatroomController.js";
import express from "express";

const router = express.Router();

router.get('/friends',chatroomList);

export default router;