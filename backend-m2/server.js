const { APIError, calculateCarValue } = require('./api/api1-takashi/carValuation');
const express = require('express');
const cors = require('cors');// Middleware for enabling Cross-Origin Resource Sharing
//Load environment variables from .env file
require('dotenv').config(); // This helps us use secret keys from a .env file!
// Initialize the Express application
const app = express();

// Load a JSON data file
// Note that the file path is relative to server.js.
// Takashi Section for API 1
const carDataSingle = require('./jsondata/car_data_single_takashi.json');
const carDataTakashi = require('./jsondata/car_data_takashi.json');
const carDataTestTakashi = require('./jsondata/car_data_test_takashi.json');

// Get the port number from environment variables
// We tell our server what "door number" (port) to listen on.
// If .env doesn't say, it'll just use 3000 as  a defualt.
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors()); // This lets other websites talk to our API safely.

// Enable JSON body parsing for incoming requests
app.use(express.json()); // This helps our API understand when you send it JSON data (like car details).


// === Our API Door for Car Value ===
// Takashi — API 1: Car Value Endpoint
// Handles POST requests to calculate car value(s)
// When someone sends a POST request to /api/car-value, our API springs to life!
app.post('/api/car-value', (req, res) => {
    // Capture the entire request body
    const requestBody = req.body; // We get all the data someone sent us.

    // Check if the request body is an array (batch request) or a single object
    // Let's check if they sent us a list of cars (an array) or just one car.
    // If it's NOT a list, we treat it like one car, just like before.
    if (!Array.isArray(requestBody)) {
        // --- Handle single car valuation request ---
        // We expect the car's name (model) and year.
        const { model, year } = requestBody; // Destructure model and year from the single object
        
      try {
            // Attempt to calculate the car value
            // We ask our brain to calculate the car value for this car.
            const carValue = calculateCarValue({ model, year });
            // If successful, send back the car value with 200 OK status
            return res.json({ carValue });
        } catch (error) {
            // If an error occurs during calculation or validation
            if (error instanceof APIError) {
                // If it's our custom APIError, send its status code and message/code
                return res.status(error.statusCode).json({
                    error: error.message,
                    errorCode: error.errorCode // Include the specific error code
                });
            } else {
                // For any other unexpected errors, log them and send a generic 500 error
                console.error("Internal Server Error:", error);
                return res.status(500).json({
                    error: "An unexpected error occurred.",
                    errorCode: 'E_INTERNAL_SERVER_ERROR' // Generic code for server-side issues
                });
            }
        }
    } else { // This block handles array (batch) requests
        // --- Handle batch car valuation request (array of car objects) ---
        // If the request body IS a list of cars (an array), we go through each one!
        // Array to store results for each car in the batch
        const results = []; // Array to store results for each car in the batch
        // A flag to remember if any car had an error.
        let hasErrors = false; // Flag to track if any item in the batch failed

        // Iterate over each car data object in the request body array
        // We go through each car in the list, one by one.
        // Iterate over each car data object in the request body array
        for (const carData of requestBody) {
            // We get the car's name (model) and year from this car's data.
            const { model, year } = carData; // Destructure model and year for the current car
            let processedItem = { ...carData }; // Create a copy to add results/errors

            try {
                // Attempt to calculate car value for the current item
                const carValue = calculateCarValue({ model, year });
                processedItem.carValue = carValue; // Add calculated value to the item
            } catch (error) {
                hasErrors = true; // Set error flag if any item fails
                if (error instanceof APIError) {
                    // --- CHANGE START ---
                    // This is the crucial part: Add both 'error' message and 'errorCode'
                    // from our custom APIError to the individual item's result.
                    processedItem.error = error.message; // Add the APIError message
                    processedItem.errorCode = error.errorCode; // Add the specific APIError code
                    // --- CHANGE END ---
                } else {
                    // For unexpected errors on a specific item (not our custom APIError)
                    console.error("Internal Server Error for item:", carData, error);
                    processedItem.error = "An unexpected error occurred for this item.";
                    processedItem.errorCode = 'E_INTERNAL_SERVER_ERROR'; // Generic code for item-specific unexpected errors
                }
            }
            results.push(processedItem); // Add the processed item (with value or error) to results
        }

        // Determine overall response status based on whether errors occurred in the batch
        if (hasErrors) {
            // If any item had an error, respond with 400 Bad Request
            // The response body will contain detailed results for each item, including errors
            return res.status(400).json(results);
        } else {
            // If all items were processed successfully, respond with 200 OK
            // The response body will contain calculated values for all items
            return res.status(200).json(results);
        }
    }
}); 

// === New API endpoints to add for Takashi ===

// API 1: Endpoint that returns single test car data
app.get('/api/test-car-single', (req, res) => {
res.json(carDataSingle);
});

// API 1: Endpoint that returns multiple (valid) test car data
app.get('/api/test-car-batch-valid', (req, res) => {
res.json(carDataTakashi);
});

// API 1: Endpoint that returns mixed (valid/invalid) test car data
app.get('/api/test-car-batch-mixed', (req, res) => {
res.json(carDataTestTakashi);
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

// Start the server only if the environment is not 'test'
// This prevents the server from starting during test runs (e.g., with Supertest)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// Export the Express app instance, primarily for testing frameworks like Supertest
module.exports = app;
