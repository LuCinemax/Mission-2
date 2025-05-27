const express = require('express');
const cors = require('cors');

require('dotenv').config();

// Kerry
const calculatePremium = require("./api/api3-kerry/quoteCalculator");

//Takashi
// Loading carValueController.js
const {
  APIError,
  calculateCarValue,
} = require("./api/api1-takashi/controllers/carValueController.js");
// --- Loading "Fake" Car Data for Testing ---
const carDataSingle = require('./jsondata/car_data_single_takashi.json');
const carDataTakashi = require('./jsondata/car_data_takashi.json');
const carDataTestTakashi = require('./jsondata/car_data_test_takashi.json');

//Sonny
const {
  calculateDiscountRate,
} = require("./api/api4-sonny/calculateDiscountRate.js");

// API 1 for Takashi endpoint component from api1-takashi/controllers/carValueController'
const carValueController = require('./api/api1-takashi/controllers/carValueController');

const app = express();


// This is like choosing which door number (port) your website will use on the internet.
// It tries to use the number from the secret file (`process.env.PORT`), or it uses 3000 if there's no secret number.
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

// --- API 1 Takashi Setting Up Website "Doors" (API Endpoints - where people can send messages) ---

// This is a special door for calculating car values.
// When someone sends a POST message (like "Hey, calculate this!") to '/api/car-value',
// our 'carValueController' manager takes over and handles the request.
app.post('/api/car-value', carValueController.handleCarValueRequest);

// --- Extra Doors for Showing Test Data (Like having a display of your toy cars) ---
// These are simple doors where you can just look at some pre-made car data.

// This door (URL) shows you one example of car data.
app.get('/api/test-car-single', (req, res) => {
    res.json(carDataSingle); // Send the single car data as a JSON message.
});

// This door shows you a list of valid cars, good for testing many cars at once.
app.get('/api/test-car-batch-valid', (req, res) => {
    res.json(carDataTakashi); // Send the list of good cars.
});

// This door shows you a list of cars, some good and some with problems, for trickier tests.
app.get('/api/test-car-batch-mixed', (req, res) => {
    res.json(carDataTestTakashi); // Send the list of mixed cars.
});
   
//-------------------------End of Takashi section----------------------------------------------------------------------
// Wisony — API 2: Risk Rating
app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

// Kerry — API 3: Quote Calculation
app.post('/api/quote', (req, res) => {
  const { car_value, risk_rating } = req.body;
//   const car_value = 6614;
//   const risk_rating = 5;

  const result = calculatePremium(car_value, risk_rating);

  if (result.error) {
    return res.status(400).json(result);
  }

  res.json(result);
});

// Sonny — API 4: Discount Rate

// POST /test endpoint
app.post("/test", (req, res) => {
  const { age, yearsOfExperience } = req.body;
  const NO_AGE = 0;
  const NO_EXPERIENCE = 0;

  // INPUT VALIDATION
  if (typeof age !== "number" || typeof yearsOfExperience !== "number") {
    return res.status(400).json({
      error: "Invalid input: age and yearsOfExperience must be numbers.",
    });
  }

  if (age < NO_AGE || yearsOfExperience < NO_EXPERIENCE) {
    return res.status(400).json({
      error: "Invalid input: age and yearsOfExperience must be non-negative.",
    });
  }

  const discount = calculateDiscountRate(age, yearsOfExperience);

  // Send the calculated discount in the response
  res.status(200).json({ discount: discount });
});


// 3. Opening Our Website for Business! (Making the website start running)
// This prevents the server from starting during test runs (e.g., with Supertest)
// Once it starts, it will print a message to the console, so you know it's ready! 
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}


// Export the Express app instance, primarily for testing frameworks like Supertest
module.exports = app;