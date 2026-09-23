import dataRoutes from "./src/routes/dataRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import createChatRoutes from "./src/routes/createChatroomRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import express from "express";

const app = express();
app.use(express.json());


app.use('/auth', authRoutes);
app.use('/api', dataRoutes);
app.use('/chat', createChatRoutes);
app.use('/message', messageRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
