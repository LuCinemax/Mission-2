const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import API 1 logic (from src/api1_car_value/carValuation.js)
// This module is required for Takashi's part
const { calculateCarValue, APIError } = require('./api1_car_value/carValuation');


const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// === API Routes by Assigned Developer ===

// Takashi — API 1: Car Value
app.post('/api/car-value', (req, res) => {
  res.json({ message: 'Taka - Car Value API working' });
});


// Wisony — API 2: Risk Rating
app.post('/api/risk-rating', (req, res) => {
  res.json({ message: 'Wisony - Risk Rating API working' });
});

// Kerry — API 3: Quote Calculation
app.post('/api/quote', (req, res) => {
  res.json({ message: 'Kerry - Quote API working' });
});

// Sonny — API 4: Discount Rate
app.post('/api/discount-rate', (req, res) => {
  res.json({ message: 'Sonny - Discount Rate API working' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
