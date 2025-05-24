const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import API 1 logic (from src/api1_car_value/carValuation.js)
// This module is required for Takashi's part
// const { calculateCarValue, APIError } = require('./api1_car_value/carValuation');


const app = express();
const PORT = process.env.PORT;

app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON request bodies

// === API Routes by Assigned Developer ===

// Takashi — API 1: Car Value
// === API 1: Car Value Logic and Router Definition (Consolidated Here) for Takashi ===

/**
 * Custom API Error class.
 * This helps us create our own error messages.
 * @extends Error
 */
class APIError extends Error {
    constructor(message, statusCode = 400) {
        super(message); // Call the parent class's constructor
        this.name = 'APIError'; // Name of the error
        this.statusCode = statusCode; // Status code for the error
    }
}

/**
 * Helper function to calculate the sum of alphabetical positions for a model name.
 * This means we add up the positions of each letter A=1, B=2, etc.
 * @param {string} modelName - The car model name.
 * @returns {number} The sum of alphabetical positions.
 */
function calculateAlphabetSum(modelName) {
    let sum = 0; // Start with a sum of 0
    const baseCharCodeA = 'A'.charCodeAt(0); // Get the code for letter 'A'

    // Loop through each letter in the model name
    for (let i = 0; i < modelName.length; i++) {
        const char = modelName[i]; // Get the current letter
        const upperChar = char.toUpperCase(); // Make it uppercase for easy checking

        // Check if the letter is between A and Z
        if (upperChar >= 'A' && upperChar <= 'Z') {
            // Add the letter's position to the sum
            sum += (upperChar.charCodeAt(0) - baseCharCodeA + 1);
        }
    }
    return sum; // Return the total sum
}

/**
 * Helper function to validate input data for the car value calculation API.
 * This checks if the input is correct.
 * @param {object} inputData - The input object to validate.
 * @throws {APIError} If validation fails.
 */
function validateCarValuationInput(inputData) {
    // Check if input is an object
    if (typeof inputData !== 'object' || inputData === null) {
        throw new APIError("Input must be a JSON object."); // Error if not an object
    }

    const model = inputData.model; // Get the model from input
    let year = inputData.year; // Get the year from input

    // Check if model is provided
    if (model === undefined) {
        throw new APIError("Missing 'model' parameter."); // Error if model is missing
    }
    if (typeof model !== 'string') {
        throw new APIError("'model' must be a string."); // Error if model is not a string
    }
    if (model.trim() === '') { // Check if model is empty
        throw new APIError("Model cannot be empty."); // Error if empty
    }

    // Check if year is provided
    if (year === undefined) {
        throw new APIError("Missing 'year' parameter."); // Error if year is missing
    }
    
    // If year is a string, try to convert it to a number
    if (typeof year === 'string') {
        // Check if it has only digits
        if (!/^\d+$/.test(year)) {
            throw new APIError("Invalid year format. Year must be an integer."); // Error if not a valid number
        }
        year = parseInt(year, 10); // Convert to an integer
    }

    // Final checks for year
    if (typeof year !== 'number' || !Number.isInteger(year) || year < 1) {
        throw new APIError("Missing or invalid 'year' parameter. Year must be a positive integer."); // Error if year is invalid
    }
    
    // If everything is good, return the cleaned model and year
    return { model, year };
}

/**
 * API 1: Main logic to calculate the car's value from its model and year.
 * @param {object} inputData - An object containing the car's model and year.
 * @returns {number} The calculated car value.
 * @throws {APIError} If input values are invalid.
 */
function calculateCarValue(inputData) {
    // Check input data using the validation function
    const { model, year } = validateCarValuationInput(inputData);

    // Calculate the alphabet sum using a helper function
    const alphabetSum = calculateAlphabetSum(model);

    // Calculate the car value
    const carValue = (alphabetSum * 100) + year;

    return carValue; // Return the final car value
}

// Here we set up the API endpoint to calculate car value
app.post('/api/car-value', (req, res) => {
    // We expect 'model' and 'year' in the request
    const { model, year } = req.body;

    try {
        // Call the function to calculate the car value
        const carValue = calculateCarValue({ model, year });
        res.json({ carValue }); // Send back the calculated value
    } catch (error) {
        if (error instanceof APIError) {
            // If it's our custom error, send the error message
            res.status(error.statusCode).json({ error: error.message });
        } else {
            // For any other errors, log and send a generic error message
            console.error("Internal Server Error:", error);
            res.status(500).json({ error: "An unexpected error occurred." });
        }
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
