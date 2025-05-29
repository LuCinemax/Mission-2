// C:\Level 5\Mission2\Mission-2_backup\backend-m2\api\api1-takashi\controllers\carValueController.js

// This file is like the "Traffic Cop" for your car value API!
// It takes messages (requests) from people, tells them what to do, and sends back the answers.

// First, we need to bring in some helpers from another file:
// - `calculateCarValue`: This is like our special "Car Value Calculator" machine.
// - `APIError`: This is how we make special "Uh-oh, something went wrong!" notes.
const {
  calculateCarValue,
  APIError,
} = require("../services/carValuationService");

/**
 * This is the main job for our Traffic Cop.
 * It's called when someone sends a POST message (like "Calculate!") to your website's '/api/car-value' street.
 *
 * @param {object} req - This is the "message" (request) someone sent to your website. It holds all the car info!
 * @param {object} res - This is how your Traffic Cop sends a "reply" (response) back to the person who asked.
 */
exports.handleCarValueRequest = (req, res) => {
  // We look at the "message body" (the main part of the message) that someone sent.
  const requestBody = req.body;

  // Is the message a list of cars (an array)? Or is it just one car?
  if (!Array.isArray(requestBody)) {
    // --- Handling a Single Car Request (Just one car's info) ---

    // First, check if the message for the single car is a proper "object" (like a neatly organized box of info).
    // If it's not an object (e.g., just plain text like "hello" or an empty box `null`), then it's wrong!
    if (typeof requestBody !== "object" || requestBody === null) {
      // Send back an "Uh-oh, bad request!" message (status 400).
      return res.status(400).json({
        error: "Input must be a JSON object for a single car request.", // Tell them what went wrong.
        errorCode: "E_INVALID_SINGLE_INPUT_TYPE", // Give a special code for this type of error.
      });
    }

    // We pull out the 'model' and 'year' from the car's message box.
    const { model, year } = requestBody;

// Kerry added this to make frontend work ------------------------------------
// Validation for required model
if (model === undefined) {
  return res.status(400).json({
    error: "Missing 'model' parameter.",
    errorCode: "E_MISSING_MODEL",
  });
}

if (typeof model !== "string") {
  return res.status(400).json({
    error: "'model' must be a string.",
    errorCode: "E_INVALID_MODEL_TYPE",
  });
}

if (model.trim() === "") {
  return res.status(400).json({
    error: "Model cannot be empty.",
    errorCode: "E_EMPTY_MODEL",
  });
}
// --------------------------------------------------------------------------


    // Now, we try to use our "Car Value Calculator" machine.
    try {
      const carValue = calculateCarValue({ model, year }); // Ask the calculator for the value!
      // If it works, send back a happy "OK!" message with the car's value.
      return res.json({ carValue });
    } catch (error) {
      // Uh-oh! If the calculator machine found a problem (an 'error'):
      // Check if it's one of our special 'APIError' notes (like a custom "Oops" message).
      if (error instanceof APIError) {
        // If it is, send back the specific error message and code from that note.
        return res.status(error.statusCode).json({
          error: error.message,
          errorCode: error.errorCode,
        });
      } else {
        // If it's a very unexpected problem (not one of our special notes), something seriously went wrong!
        // Print a big warning for us programmers to see (not for the user).
        console.error("Internal Server Error for single request:", error);
        // Send a general "Something broke on our side!" message (status 500).
        return res.status(500).json({
          error: "An unexpected error occurred.",
          errorCode: "E_INTERNAL_SERVER_ERROR",
        });
      }
    }
  } else {
    // --- Handling a Batch Request (A whole list of cars!) ---

    // We'll prepare an empty list to put all our car results in.
    const results = [];
    let hasErrors = false; // A flag to remember if any car in the list had a problem.

    // We go through each car in the list, one by one.
    for (const carData of requestBody) {
      // We start with a copy of the car's original data, so we can add the value or error to it.
      let processedItem = { ...carData };

      try {
        // First, check if each item in the list is a proper car "object."
        // It can't be empty (null) or another list inside the list!
        if (
          typeof carData !== "object" ||
          carData === null ||
          Array.isArray(carData)
        ) {
          // If it's not a proper object, we throw our special "Uh-oh!" note for this problem.
          throw new APIError(
            "Each item in the batch must be a JSON object.",
            400,
            "E_INVALID_BATCH_ITEM_TYPE"
          );
        }

        // Get the model and year for the current car from the list.
        const { model, year } = carData;

        // Ask the "Car Value Calculator" machine for this car's value.
        const carValue = calculateCarValue({ model, year });
        // Add the calculated car value to this car's result.
        processedItem.carValue = carValue;
      } catch (error) {
        hasErrors = true; // Oh no, a problem happened with one of the cars!
        // If the problem is one of our special 'APIError' notes:
        if (error instanceof APIError) {
          // Add the specific error message and code to this car's result.
          processedItem.error = error.message;
          processedItem.errorCode = error.errorCode;
        } else {
          // If it's a super unexpected problem, something broke on our side for this car.
          console.error(
            "Internal Server Error for batch item:",
            carData,
            error
          );
          processedItem.error = "An unexpected error occurred for this item.";
          processedItem.errorCode = "E_INTERNAL_SERVER_ERROR_ITEM";
        }
      }
      // Add this car's result (value or error) to our main 'results' list.
      results.push(processedItem);
    }

    // After checking ALL the cars in the list:
    if (hasErrors) {
      // If even one car had an error, send back a "Bad Request" (400) status for the whole list.
      return res.status(400).json(results); // Send the full list of results (some with errors).
    } else {
      // If ALL the cars were calculated successfully, send back a happy "OK!" (200) status.
      return res.status(200).json(results); // Send the full list of all successful results.
    }
  }
};

// IMPORTANT: We only let this file export `handleCarValueRequest`!
// We don't export the calculator or the error notes directly from *this* file,
// because they are already managed by `carValuationService.js`.
// So, things like `calculateCarValue` or `APIError` are *used* here but not *exported* from here.
// This helps keep our code neat and organized, like keeping toys in their correct bins!
