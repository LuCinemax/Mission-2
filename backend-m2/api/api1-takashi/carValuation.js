const express = require('express');
const router = express.Router();


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

module.exports = {
  APIError,
  calculateCarValue
};