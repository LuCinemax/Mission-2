const express = require('express');
const cors = require('cors');
require('dotenv').config(); // This helps us use secret keys from a .env file!

const app = express();
// We tell our server what "door number" (port) to listen on.
// If .env doesn't say, it'll just use 3000.
const PORT = process.env.PORT || 3000;

app.use(cors()); // This lets other websites talk to our API safely.
app.use(express.json()); // This helps our API understand when you send it JSON data (like car details).


// Takashi — API 1: Car Value
// === Our special tools for calculating car value ===

/**
 * Custom API Error class.
 * This helps us create our own error messages when something goes wrong.
 * Think of it as a special "uh-oh" message for our API.
 * @extends Error
 */
class APIError extends Error {
    constructor(message, statusCode = 400) {
        super(message); // We build on top of a normal error.
        this.name = 'APIError'; // We give our error a special name.
        this.statusCode = statusCode; // We give it a special number (like 400 for a "bad request").
    }
}

/**
 * Helper function to calculate the "alphabet power" of a car model name.
 * We add up the positions of each letter: A=1, B=2, etc.
 * Non-letters are ignored, like magic!
 * @param {string} modelName - The car model name (like "Civic").
 * @returns {number} The total "alphabet power" number.
 */
function calculateAlphabetSum(modelName) {
    let sum = 0; // We start counting from zero.
    const baseCharCodeA = 'A'.charCodeAt(0); // This is the secret number for the letter 'A'.

    // We look at each letter in the car's name.
    for (let i = 0; i < modelName.length; i++) {
        const char = modelName[i]; // Get one letter.
        const upperChar = char.toUpperCase(); // Make it big letter, so 'a' and 'A' are the same.

        // Is it a letter from A to Z?
        if (upperChar >= 'A' && upperChar <= 'Z') {
            // Yes! Add its "alphabet power" to our sum.
            sum += (upperChar.charCodeAt(0) - baseCharCodeA + 1);
        }
    }
    return sum; // Give back the total "alphabet power".
}

/**
 * Helper function to check if the car information you send is good.
 * It's like a bouncer checking IDs at a party.
 * @param {object} inputData - The car details (like { model: "Civic", year: 2020 }).
 * @throws {APIError} If the information is not good, it throws an "uh-oh" message.
 */
function validateCarValuationInput(inputData) {
    // Is it a proper set of car details (an object)?
    if (typeof inputData !== 'object' || inputData === null) {
        throw new APIError("Input must be a JSON object."); // Uh-oh! Not a proper car detail set.
    }

    const model = inputData.model; // Get the car's name.
    let year = inputData.year; // Get the car's year.

    // Is the car's name there?
    if (model === undefined) {
        throw new APIError("Missing 'model' parameter."); // Uh-oh! No car name.
    }
    // Is the car's name made of words (a string)?
    if (typeof model !== 'string') {
        throw new APIError("'model' must be a string."); // Uh-oh! Car name is not words.
    }
    // Is the car's name empty?
    if (model.trim() === '') {
        throw new APIError("Model cannot be empty."); // Uh-oh! Car name is empty.
    }

    // Is the car's year there?
    if (year === undefined) {
        throw new APIError("Missing 'year' parameter."); // Uh-oh! No car year.
    }

    // If the year is words (a string), can we make it a number?
    if (typeof year === 'string') {
        // Does it look like only numbers?
        if (!/^\d+$/.test(year)) {
            throw new APIError("Invalid year format. Year must be an integer."); // Uh-oh! Year is not a number.
        }
        year = parseInt(year, 10); // Turn the words into a real number.
    }

    // Is the year a proper number (not negative, not a decimal)?
    if (typeof year !== 'number' || !Number.isInteger(year) || year < 1) {
        throw new APIError("Missing or invalid 'year' parameter. Year must be a positive integer."); // Uh-oh! Year is wrong.
    }

    // Hooray! All checks passed. Here are the good car name and year.
    return { model, year };
}

/**
 * API 1: This is the main brain that calculates the car's value.
 * It uses the car's name and year.
 * @param {object} inputData - An object with the car's name (model) and year.
 * @returns {number} The magic car value!
 * @throws {APIError} If something is wrong with the car details.
 */
function calculateCarValue(inputData) {
    // First, we check if the car details are good using our "bouncer" function.
    const { model, year } = validateCarValuationInput(inputData);

    // Then, we find the "alphabet power" of the car's name.
    const alphabetSum = calculateAlphabetSum(model);

    // Now, we do the final math: (alphabet power * 100) + year.
    const carValue = (alphabetSum * 100) + year;

    return carValue; // Here's the car's value!
}

// === Our API Door for Car Value ===
// When someone sends a POST request to /api/car-value, our API springs to life!
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
