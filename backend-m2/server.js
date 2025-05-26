const { APIError, calculateCarValue } = require('./api/api1-takashi/carValuation');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// === API Routes by Assigned Developer ===

// Takashi — API 1: Car Value
app.post('/api/car-value', (req, res) => {
    const requestBody = req.body; // We get all the data someone sent us.

    // Let's check if they sent us a list of cars (an array) or just one car.
    // If it's NOT a list, we treat it like one car, just like before.
    if (!Array.isArray(requestBody)) {
        // We expect the car's name (model) and year.
        const { model, year } = requestBody;

        try {
            // We ask our brain to calculate the car value for this one car.
            const carValue = calculateCarValue({ model, year });
            return res.json({ carValue }); // We send back the calculated value.
        } catch (error) {
            // Uh-oh! Something went wrong.
            if (error instanceof APIError) {
                // If it's our special "uh-oh" message, we send that back with a "bad request" number (400).
                return res.status(error.statusCode).json({ error: error.message });
            } else {
                // If it's a mystery error, we write it down for us to check later
                // and send a general "something went wrong" message.
                console.error("Internal Server Error:", error);
                return res.status(500).json({ error: "An unexpected error occurred." });
            }
        }
    }

    // If the request body IS a list of cars (an array), we go through each one!
    const results = []; // This list will hold the value for each car, or an error.
    let hasErrors = false; // A flag to remember if any car had an error.

    // We go through each car in the list, one by one.
    for (const carData of requestBody) {
        // We get the car's name (model) and year from this car's data.
        const { model, year } = carData;
        let processedItem = { ...carData }; // We make a copy of the car's original details.

        try {
            // We ask our brain to calculate the car value for this car.
            const carValue = calculateCarValue({ model, year });
            processedItem.carValue = carValue; // We add the calculated value to our car's details.
        } catch (error) {
            hasErrors = true; // Oh no, an error happened for this car!
            if (error instanceof APIError) {
                processedItem.error = error.message; // We add our special "uh-oh" message for this car.
            } else {
                // If it's a mystery error, we write it down for us to check later
                // and add a general "something went wrong" message for this car.
                console.error("Internal Server Error for item:", carData, error);
                processedItem.error = "An unexpected error occurred for this item.";
            }
        }
        results.push(processedItem); // We add this car's details (with value or error) to our list of results.
    }

    // Now, we decide what kind of "answer" to send back.
    if (hasErrors) {
        // If even one car had an error, we send a "bad request" number (400)
        // and the list showing which cars worked and which didn't.
        return res.status(400).json(results);
    } else {
        // If all cars were calculated perfectly, we send a "success" number (200)
        // and the list with all the car values.
        return res.status(200).json(results);
    }
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
