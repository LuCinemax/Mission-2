// C:\Level 5\Mission2\Mission-2_backup\backend-m2\api\api1-takashi\utils\apiError.js

// This file is like a special "Uh-oh! Problem Report" form!
// When something goes wrong in our website's brain, we fill out this form
// to clearly say what happened.

/**
 * Think of this as a special kind of "Problem Report" form.
 * It's smarter than a regular "Error!" note because it lets us add:
 * - A friendly message about the problem.
 * - A secret number for web browsers (like 400 for "You made a mistake!").
 * - A special code just for us programmers (like 'E_MISSING_MODEL').
 */
class APIError extends Error {
    /**
     * When we want to fill out a new "Problem Report" form, we tell it:
     * @param {string} message - This is the easy-to-understand text about what went wrong.
     * @param {number} [statusCode=500] - This is a secret number (like a code for the police).
     * 400 means "You messed up!", 404 means "Couldn't find it!",
     * and 500 means "Something broke on our side!".
     * @param {string} [errorCode='E_UNKNOWN'] - This is a special secret code just for us programmers.
     * It helps us find the exact problem much faster (like 'E_BAD_YEAR_NUMBER').
     */
    constructor(message, statusCode = 500, errorCode = 'E_UNKNOWN') {
        // `super(message)` is like writing the main problem on the top of the form.
        super(message);
        this.name = 'APIError';      // We give our form a simple name: "API Problem".
        this.statusCode = statusCode; // We write down the secret number for web browsers.
        this.errorCode = errorCode;   // We write down our special secret code.

        // This magic line helps us track *exactly* where in our code this "Uh-oh!" happened.
        // It's like leaving breadcrumbs to find the source of the problem later if we need to fix it.
        Error.captureStackTrace(this, this.constructor);
    }
}

// This line is like saying, "Okay, this 'APIError' Problem Report form is ready!
// Other parts of our website can now use it when they need to report a problem."
module.exports = APIError;