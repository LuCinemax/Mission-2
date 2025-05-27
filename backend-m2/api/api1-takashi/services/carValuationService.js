// C:\Level 5\Mission2\Mission-2_backup\backend-m2\api\api1-takashi\services\carValuationService.js

// This file is like the "Brain" of your car value calculator!
// It knows all the secret rules for figuring out how much a car is worth.

// --- 1. How We Talk About "Oops!" Moments (Errors) ---

// Imagine this is a special "Uh-oh!" note that we use when something goes wrong.
// Instead of just saying "Error!", it helps us say *why* it went wrong, like:
// "Uh-oh, you forgot the car model!"
class APIError extends Error {
    // When we make a new "Uh-oh!" note, we tell it:
    // - `message`: What went wrong (like "Missing 'model' parameter").
    // - `statusCode`: A secret number for web browsers (like 400 for "You sent bad info").
    // - `errorCode`: A special code for us programmers (like 'E_MISSING_MODEL').
    constructor(message, statusCode = 400, errorCode = 'E_UNKNOWN') {
        // `super(message)` is like writing the main problem on the note.
        super(message);
        this.name = 'APIError';       // We give our special note a name, like "API Oops!".
        this.statusCode = statusCode; // We write the web browser's secret number.
        this.errorCode = errorCode;   // We write our special problem code.
        // This helps us find where the problem happened in our code, like a clue for a detective!
        Error.captureStackTrace(this, this.constructor);
    }
}

// --- 2. The Super Smart Car Value Calculator ---

/**
 * This is the main "Car Value Calculator" machine.
 * You tell it a car's **model** (like "Civic") and **year** (like 2010),
 * and it tries to figure out its value.
 *
 * It also has a built-in "Checker" to make sure the model and year you tell it are correct!
 *
 * @param {object} carDetails - This is a box of information about the car.
 * @param {string} carDetails.model - The car's name (like "Civic" or "Porsche"). It needs to be text!
 * @param {number} carDetails.year - The year the car was made (like 2010 or 2023). It needs to be a number!
 * @returns {number} The magic number that is the car's value.
 * @throws {APIError} If you give it bad information, it throws one of our "Uh-oh!" notes.
 */
function calculateCarValue({ model, year }) {
    // --- Checking the Inputs (Making sure the info you gave is good!) ---

    // **Check 1: Is the 'model' name missing?**
    // If someone forgets to tell us the car's model, that's a problem!
    if (model === undefined || model === null) {
        // We throw an "Uh-oh!" note: "Missing model!"
        throw new APIError("Missing 'model' parameter.", 400, 'E_MISSING_MODEL');
    }

    // **Check 2: Is 'model' a text string (words), not a number or anything else?**
    // A car's name should be words, not numbers!
    if (typeof model !== 'string') {
        // We throw an "Uh-oh!" note: "Model must be text!"
        throw new APIError("'model' must be a string.", 400, 'E_INVALID_MODEL_TYPE');
    }

    // **Check 3: Is the 'model' name completely empty (even after removing spaces)?**
    // A car needs a name, even a short one!
    if (model.trim() === '') { // `.trim()` cleans up any extra spaces at the beginning or end.
        // We throw an "Uh-oh!" note: "Model cannot be empty!"
        throw new APIError("Model cannot be empty.", 400, 'E_EMPTY_MODEL');
    }

    // **Check 4: Is the 'year' missing?**
    // Just like the model, we need to know the year the car was made.
    if (year === undefined || year === null) {
        // We throw an "Uh-oh!" note: "Missing year!"
        throw new APIError("Missing 'year' parameter.", 400, 'E_MISSING_YEAR');
    }

    // **Check 5: Is 'year' a whole number (like 2020), not a decimal or "hello"?**
    // The year should be a proper number, not like "two thousand" or "2020.5".
    if (isNaN(year) || typeof year !== 'number' || !Number.isInteger(year)) {
        // We throw an "Uh-oh!" note: "Year format is wrong!"
        throw new APIError("Invalid year format. Year must be an integer.", 400, 'E_INVALID_YEAR_FORMAT');
    }

    // **Check 6: Is 'year' a positive number?**
    // Cars can't be made in year zero or a year before time began!
    if (year < 0) {
        // We throw an "Uh-oh!" note: "Year must be positive!"
        throw new APIError("Missing or invalid 'year' parameter. Year must be a positive integer.", 400, 'E_INVALID_YEAR_VALUE');
    }

    // --- Time for the Magic Math! (Calculating the Car's Value) ---
    // If we get here, it means all the checks passed, so we can start calculating!

    // This part gives points based on the letters in the car's model name.
    // 'a' gets 1 point, 'b' gets 2 points, and so on. We add all the points together.
    // Example: "Civic" -> c(3) + i(9) + v(22) + i(9) + c(3) = 46 points!
    const modelFactor = model.toLowerCase().split('').reduce((sum, char) => {
        if (char >= 'a' && char <= 'z') { // We only count letters, not symbols like '!'
            return sum + (char.charCodeAt(0) - 'a'.charCodeAt(0) + 1);
        }
        return sum; // If it's not a letter, it adds nothing.
    }, 0); // We start our point counting from 0.

    const baseValue = 10000; // Every car starts with a base value of $10,000.
    // For every year *after* the year 2000, we add $100 to the value.
    // Example: A 2010 car adds (2010 - 2000) * 100 = 10 * 100 = $1000.
    const yearContribution = (year - 2000) * 100;
    // We multiply the model's points by $50 to add more value based on the name.
    // Example: If 'modelFactor' is 46, this adds 46 * 50 = $2300.
    const modelContribution = modelFactor * 50;

    // Now, we add up all the parts to get the total estimated car value!
    let carValue = baseValue + yearContribution + modelContribution;

    // Super important! We make sure the car value is never negative (less than zero).
    // You can't owe money for your car! The lowest value is always $0.
    carValue = Math.max(0, carValue); // Choose the bigger number: 0 or the calculated value.

    return carValue; // We tell you the car's value!
}

// --- 3. Sharing Our Tools with Other Parts of the Website ---

// This line is like saying, "Hey, other files! You can use these special tools from this file:"
module.exports = {
    calculateCarValue, // They can use our "Car Value Calculator" machine.
    APIError           // And they can use our special "Uh-oh!" notes.
};