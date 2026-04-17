// src/server.js
const express = require('express');
const cors = require('cors');
const path = require('path'); // Required for serving the frontend folder
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');

// 1. Initialize the Express app FIRST
const app = express();
const PORT = process.env.PORT || 3000;

// 2. Setup Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON payloads

// 3. Serve the static frontend (Must come AFTER const app = express())
app.use(express.static(path.join(__dirname, '../public')));

// 4. Connect Routes
app.use('/api/orders', orderRoutes);

// 5. Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});