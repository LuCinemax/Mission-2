// C:\Level 5\Mission2\Mission-2_backup\backend-m2\server.js

// This file is like the main control center for your entire car value website (API)!

// 1. Getting Our Tools Ready (Like gathering ingredients for a recipe)

// 'express' is a super popular tool that helps us build web applications easily.
// Think of it as a special building kit for websites.
const express = require('express');
// 'cors' is a helpful guard. It decides who is allowed to talk to your website from other places on the internet.
// It's like setting up a gate to let friendly visitors in.
const cors = require('cors');
// 'dotenv' is like a secret keeper. It helps us load special secret codes (like the port number)
// from a hidden '.env' file, so they don't get accidentally shared.
require('dotenv').config();

// We bring in the 'carValueController'. This is like a special manager
// for your car value calculations. It knows what to do when someone asks for a car value.
// API 1 for Takashi endpoint component from api1-takashi/controllers/carValueController'
const carValueController = require('./api/api1-takashi/controllers/carValueController');

// 2. Setting Up Our Website (Starting to build with our tools)

// We create our main website application using 'express'.
// This 'app' variable is now our website's brain!
const app = express();

// --- Loading "Fake" Car Data for Testing (Like having toy cars to play with) ---
// These files are like small lists of pretend car information.
// We load them directly here because we'll just show them when someone asks for them.
const carDataSingle = require('./jsondata/car_data_single_takashi.json');
const carDataTakashi = require('./jsondata/car_data_takashi.json');
const carDataTestTakashi = require('./jsondata/car_data_test_takashi.json');

// This is like choosing which door number (port) your website will use on the internet.
// It tries to use the number from the secret file (`process.env.PORT`), or it uses 3000 if there's no secret number.
const PORT = process.env.PORT || 3000;

// --- Adding Special Rules for Our Website (Setting up how it works) ---

// 'app.use(cors());' tells our website's guard ('cors') to let everyone visit.
// This is important so other websites can talk to your car value calculator.
app.use(cors());
// 'app.use(express.json());' teaches our website to understand messages that are written in "JSON" language.
// JSON is a popular way computers talk to each other, like sending a note that says { "model": "Civic", "year": 2014 }.
app.use(express.json());

// --- Setting Up Website "Doors" (API Endpoints - where people can send messages) ---

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

// 3. Opening Our Website for Business! (Making the website start running)
// Start the server only if the environment is not 'test'
// This prevents the server from starting during test runs (e.g., with Supertest)
if (process.env.NODE_ENV !== 'test') {
  // This line tells our website to actually start listening for visitors on the chosen door number (PORT).
  // Once it starts, it will print a message to the console, so you know it's ready! 
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// Export the Express app instance, primarily for testing frameworks like Supertest
module.exports = app;
