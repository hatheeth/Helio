import dataRoutes from "./src/routes/dataRoutes";



const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

// Example API route
app.get('/api/data', (req, res) => {
  res.json({ message: 'This is sample data' });
});

app.use('/api', dataRoutes);
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
