// 1. Getting Our Tools Ready (Like gathering ingredients for a recipe)
// Think of it as a special building kit for websites.
const express = require("express");
// 'cors' is a helpful guard. It decides who is allowed to talk to your website from other places on the internet.
// It's like setting up a gate to let friendly visitors in.
const cors = require("cors");
// 'dotenv' is like a secret keeper. It helps us load special secret codes (like the port number)
// from a hidden '.env' file, so they don't get accidentally shared.

require("dotenv").config();

//Kerry
const calculatePremium = require("./api/api3-kerry/quoteCalculator");
 
//Takashi
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
 
 
// We bring in the 'carValueController'. This is like a special manager
// for your car value calculations. It knows what to do when someone asks for a car value.

const app = express();

//Takashi
// Loading carValueController.js
// This file is like the main control center for your entire car value website (API)!
// API 1 for Takashi endpoint component from api1-takashi/controllers/carValueController'
const carValueController = require("./api/api1-takashi/controllers/carValueController");

// 2. Setting Up Our Website (Starting to build with our tools)
 
// We create our main website application using 'express'.
// This 'app' variable is now our website's brain!
 
// --- Loading "Fake" Car Data for Testing (Like having toy cars to play with) ---
// These files are like small lists of pretend car information.
// We load them directly here because we'll just show them when someone asks for them.

// This is like choosing which door number (port) your website will use on the internet.
// It tries to use the number from the secret file (`process.env.PORT`), or it uses 3000 if there's no secret number.
const PORT = process.env.PORT || 3000;
 
// 'app.use(cors());' tells our website's guard ('cors') to let everyone visit.
// This is important so other websites can talk to your car value calculator.

app.use(cors());

app.use(express.json());


// --- API 1 Takashi Setting Up Website "Doors" (API Endpoints - where people can send messages) ---
// This is a special door for calculating car values.
// When someone sends a POST message (like "Hey, calculate this!") to '/api/car-value',
// our 'carValueController' manager takes over and handles the request.

app.post("/api/car-value", carValueController.handleCarValueRequest);


// --- Extra Doors for Showing Test Data (Like having a display of your toy cars) ---
// These are simple doors where you can just look at some pre-made car data.
 
// This door (URL) shows you one example of car data.
app.get("/api/test-car-single", (req, res) => {
  res.json(carDataSingle); // Send the single car data as a JSON message.
});
 
// This door shows you a list of valid cars, good for testing many cars at once.
app.get("/api/test-car-batch-valid", (req, res) => {
  res.json(carDataTakashi); // Send the list of good cars.
});
 
// This door shows you a list of cars, some good and some with problems, for trickier tests.
app.get("/api/test-car-batch-mixed", (req, res) => {
  res.json(carDataTestTakashi); // Send the list of mixed cars.
});

//-------------------------End of Takashi section----------------------------------------------------------------------

const keywords = ["crash", "scratch", "collide", "bump", "smash"];
const maxKeywords = 5
const noKeywords = 0
// Wisony — API 2: Risk Rating

app.post("/api/risk-rating", (req, res) => {
  //Getting the claim_history from user input
  const { claim_history } = req.body;


  if (typeof claim_history !== "string" || claim_history.trim() === "") {
    return res.status(400).json({ error: "Invalid input entered" });
  }
  
  const lowerCaseText = claim_history.toLowerCase();
  
  let keywordCount = 0;
  //Loops through keywords array for every keyword match in the claim history
  for (const word of keywords) {
    //creates a global(matches all occurrences) and case insensitive regular expression for the keywords
    const regex = new RegExp(word, "gi");
    //matches all the keywords in the claim history
    const keywordMatches = lowerCaseText.match(regex);
    //counts all the keywords in the claim history and adds to the count
    //if no keywords are found count will stay at 0
    keywordCount += keywordMatches ? keywordMatches.length : 0;
  }
  //If there are more then 5 keywords in claim history it will return an error
  if (keywordCount > maxKeywords) {
    return res.status(400).json({ error: "To many risky events" });
  }
  if (keywordCount === noKeywords){
    return res.status(400).json({ error: "No risky events"})
  }
  return res.status(200).json({ risk_rating: keywordCount });
});
 
// Kerry — API 3: Quote Calculation
app.post("/api/quote", (req, res) => {
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
app.post("/api/calculateDiscount", (req, res) => {
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
  console.log(discount) 
  res.status(200).json({ discount: discount });
}); 

// 3. Opening Our Website for Business! (Making the website start running)
// This prevents the server from starting during test runs (e.g., with Supertest)

// Once it starts, it will print a message to the console, so you know it's ready! 

// This line tells our website to actually start listening for visitors on the chosen door number (PORT).
// Once it starts, it will print a message to the console, so you know it's ready!

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// Export the Express app instance, primarily for testing frameworks like Supertest
module.exports = app;