import dataRoutes from "./src/routes/dataRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import express from "express";

const app = express();

// Middleware to parse JSON
app.use(express.json());


app.use('/auth', authRoutes);
app.use('/api', dataRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
