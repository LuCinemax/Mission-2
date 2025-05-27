const { APIError, calculateCarValue } = require('./api/api1-takashi/carValuation');
const express = require('express');
<<<<<<< HEAD
const cors = require('cors');// Middleware for enabling Cross-Origin Resource Sharing
//Load environment variables from .env file
require('dotenv').config(); // This helps us use secret keys from a .env file!
// Initialize the Express application
const app = express();

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
   
=======
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

>>>>>>> 56af15fba2f93b6010f5f450febc32f17b86b410
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

<<<<<<< HEAD
// Start the server only if the environment is not 'test'
// This prevents the server from starting during test runs (e.g., with Supertest)
=======
>>>>>>> 56af15fba2f93b6010f5f450febc32f17b86b410
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

<<<<<<< HEAD
// Export the Express app instance, primarily for testing frameworks like Supertest
=======
>>>>>>> 56af15fba2f93b6010f5f450febc32f17b86b410
module.exports = app;
