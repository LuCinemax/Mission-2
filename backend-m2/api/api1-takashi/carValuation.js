<<<<<<< HEAD
// C:\Level 5\Mission2\Mission-2\backend-m2\api\api1-takashi\carValuation.js
=======
>>>>>>> 56af15fba2f93b6010f5f450febc32f17b86b410
const express = require('express');
const router = express.Router();


// Takashi — API 1: Car Value
// === Our special tools for calculating car value ===

/**
 * Custom API Error class.
<<<<<<< HEAD
 * This class extends the built-in Error, allowing us to attach specific HTTP status codes
 * and custom error codes (e.g., 'E_MISSING_MODEL') for better client-side handling.
 * @extends Error
 */
class APIError extends Error {
    /**
     * Creates an instance of APIError.
     * @param {string} message - A human-readable error message.
     * @param {number} [statusCode=400] - The HTTP status code (e.g., 400 for Bad Request).
     * @param {string} [errorCode='GENERIC_ERROR'] - A specific, machine-readable error code.
     */
    constructor(message, statusCode = 400, errorCode = 'GENERIC_ERROR') {
        super(message); // Call the parent Error constructor
        this.name = 'APIError'; // Set a custom name for the error type
        this.statusCode = statusCode; // Store the HTTP status code
        this.errorCode = errorCode; // Store our custom error code
=======
 * This helps us create our own error messages when something goes wrong.
 * Think of it as a special "uh-oh" message for our API.
 * @extends Error
 */
class APIError extends Error {
    constructor(message, statusCode = 400) {
        super(message); // We build on top of a normal error.
        this.name = 'APIError'; // We give our error a special name.
        this.statusCode = statusCode; // We give it a special number (like 400 for a "bad request").
>>>>>>> 56af15fba2f93b6010f5f450febc32f17b86b410
    }
}

/**
 * Helper function to calculate the "alphabet power" of a car model name.
<<<<<<< HEAD
 * Each letter's position in the alphabet (A=1, B=2, ...) is summed up.
 * Non-alphabetic characters are ignored.
 * @param {string} modelName - The car model name (e.g., "Civic").
 * @returns {number} The total "alphabet power" numerical sum.
 */
function calculateAlphabetSum(modelName) {
    let sum = 0; // Initialize sum to zero
    const baseCharCodeA = 'A'.charCodeAt(0); // ASCII value for 'A'

    // Iterate over each character in the model name
    for (let i = 0; i < modelName.length; i++) {
        const char = modelName[i]; // Get current character
        const upperChar = char.toUpperCase(); // Convert to uppercase for case-insensitivity

        // Check if the character is an English alphabet letter
        if (upperChar >= 'A' && upperChar <= 'Z') {
            // Add its alphabetical position (1-indexed) to the sum
            sum += (upperChar.charCodeAt(0) - baseCharCodeA + 1);
        }
    }
    return sum; // Return the calculated sum
}

/**
 * Helper function to validate the input data for car valuation.
 * Throws an APIError if any validation rule is violated, providing
 * a specific error message and code.
 * @param {object} inputData - An object expected to contain 'model' and 'year'.
 * @throws {APIError} If the input data is invalid.
 * @returns {{model: string, year: number}} The validated and parsed model and year.
 */
function validateCarValuationInput(inputData) {
    // Ensure the input is a proper JSON object
    if (typeof inputData !== 'object' || inputData === null) {
        throw new APIError("Input must be a JSON object.", 400, 'E_INVALID_INPUT_TYPE');
    }

    const model = inputData.model; // Extract the model
    let year = inputData.year; // Extract the year

    // Validate 'model' parameter
    if (model === undefined) {
        throw new APIError("Missing 'model' parameter.", 400, 'E_MISSING_MODEL');
    }
    if (typeof model !== 'string') {
        throw new APIError("'model' must be a string.", 400, 'E_INVALID_MODEL_TYPE');
    }
    if (model.trim() === '') {
        throw new APIError("Model cannot be empty.", 400, 'E_EMPTY_MODEL');
    }

    // Validate 'year' parameter
    if (year === undefined) {
        throw new APIError("Missing 'year' parameter.", 400, 'E_MISSING_YEAR');
    }

    // If year is a string, attempt to parse it as an integer
    if (typeof year === 'string') {
        if (!/^\d+$/.test(year)) { // Check if it contains only digits
            throw new APIError("Year must be a positive integer. Invalid format.", 400, 'E_INVALID_YEAR_FORMAT');
        }
        year = parseInt(year, 10); // Convert string to integer
    }

    // Validate parsed year: must be a number, an integer, and positive
    if (typeof year !== 'number' || !Number.isInteger(year) || year < 1) {
        let detailMessage;
        if (year === null) {
            detailMessage = "'year' cannot be null.";
        } else if (typeof year !== 'number') {
            detailMessage = "'year' must be a number."; // Though previous checks handle string, this covers other types
        } else if (!Number.isInteger(year)) {
            detailMessage = "'year' must be an integer (no decimals).";
        } else { // year < 1
            detailMessage = "'year' must be a positive integer (greater than 0).";
        }
        throw new APIError(`Invalid 'year' parameter. ${detailMessage}`, 400, 'E_INVALID_YEAR_VALUE');
    }

    // Return validated and potentially parsed values
=======
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
>>>>>>> 56af15fba2f93b6010f5f450febc32f17b86b410
    return { model, year };
}

/**
<<<<<<< HEAD
 * API 1: Core logic to calculate a car's value based on its model and year.
 * It combines the "alphabet power" of the model name with the year.
 * @param {object} inputData - An object containing 'model' (string) and 'year' (number).
 * @returns {number} The calculated car value.
 * @throws {APIError} If the input data is invalid according to validation rules.
 */
function calculateCarValue(inputData) {
    // First, validate the input data; this will throw an APIError if invalid
    const { model, year } = validateCarValuationInput(inputData);

    // Calculate the alphabet sum for the model name
    const alphabetSum = calculateAlphabetSum(model);

    // Apply the valuation formula: (alphabet sum * 100) + year
    const carValue = (alphabetSum * 100) + year;

    return carValue; // Return the final calculated value
}

// Export functions and classes to be used by other modules
module.exports = {
    APIError,
    calculateCarValue
=======
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

module.exports = {
  APIError,
  calculateCarValue
>>>>>>> 56af15fba2f93b6010f5f450febc32f17b86b410
};