// C:\Level 5\Mission2\Mission-2_backup\backend-m2\tests\api-1.test.js

// Imagine 'supertest' is like a super-smart robot that can visit your website (API)
// and try sending different messages to it, just like a person's web browser would.
const request = require('supertest');
// 'app' is the main part of your website (your Express application) that 'supertest' will visit.
// We need to tell the robot where your website lives!
const app = require('../server'); // We assume your main Express app is set up in a file called 'server.js'

// 'describe' is like creating a big folder for all the tests that belong together.
// This folder is for all the tests about your "Car Value" part of the API.
describe('API 1: Car Value Endpoint (Integration Tests - /api/car-value)', () => {

    // This is a special little helper function. It's like a small calculator built right into our tests.
    // It figures out what the car's value *should* be, using the exact same rules as your real API.
    // We use it to compare the API's answer with what we expect to make sure the math is right!
    const calculateExpectedCarValue = (model, year) => {
        // These are the same steps your real 'carValuationService.js' uses to calculate the value.
        const modelFactor = model.toLowerCase().split('').reduce((sum, char) => {
            if (char >= 'a' && char <= 'z') { // Check if the character is a letter from a to z
                return sum + (char.charCodeAt(0) - 'a'.charCodeAt(0) + 1); // 'a' is 1, 'b' is 2, etc.
            }
            return sum; // If it's not a letter (like '!' or numbers), add nothing to the sum.
        }, 0); // Start counting from zero.

        const baseValue = 10000; // Every car starts at $10,000.
        const yearContribution = (year - 2000) * 100; // Cars made after 2000 get more value.
        const modelContribution = modelFactor * 50; // The letters in the model name add to the value.

        let carValue = baseValue + yearContribution + modelContribution; // Add all parts together.
        return Math.max(0, carValue); // Make sure the value is never less than $0.
    };


    // --- Positive Test Cases (These are like "happy path" tests where everything should work!) ---

    // 'test' is one specific check. We're testing if sending a "Civic" from 2014 works correctly.
    test('should return 200 and car value for valid Civic request', async () => {
        const model = "Civic";
        const year = 2014;
        // First, we figure out what the answer *should* be using our helper calculator.
        const expectedCarValue = calculateExpectedCarValue(model, year); // For Civic 2014, it should be 13700.

        // Now, we tell our robot ('supertest') to visit the API:
        const res = await request(app) // Ask our app...
            .post('/api/car-value') // ...to handle a POST request to '/api/car-value'...
            .send({ model, year }); // ...and send it a message (data) about the car.

        // Finally, we check the robot's report:
        expect(res.statusCode).toBe(200); // Did the API say "OK" (status code 200)?
        expect(res.body.carValue).toBe(expectedCarValue); // Did the API give us the correct car value?
    });

    test('should return 200 and car value for valid Porsche request', async () => {
        const model = "Porsche";
        const year = 2023;
        const expectedCarValue = calculateExpectedCarValue(model, year); // For Porsche 2023, it should be 16500.
        const res = await request(app)
            .post('/api/car-value')
            .send({ model, year });
        expect(res.statusCode).toBe(200);
        expect(res.body.carValue).toBe(expectedCarValue);
    });

    // --- Edge Cases (These tests try slightly unusual but still "correct" ways to send data) ---

    test('should return 200 and car value for model with a single letter (A)', async () => {
        const model = "A"; // Model name is just one letter.
        const year = 2000;
        const expectedCarValue = calculateExpectedCarValue(model, year); // e.g., 10050.
        const res = await request(app)
            .post('/api/car-value')
            .send({ model, year });
        expect(res.statusCode).toBe(200);
        expect(res.body.carValue).toBe(expectedCarValue);
    });

    test('should return 200 and car value for model with mixed casing (cIvIc)', async () => {
        const model = "cIvIc"; // Model name has a mix of small and capital letters.
        const year = 2014;
        const expectedCarValue = calculateExpectedCarValue(model, year); // Should still be 13700 because the API converts to lowercase.
        const res = await request(app)
            .post('/api/car-value')
            .send({ model, year });
        expect(res.statusCode).toBe(200);
        expect(res.body.carValue).toBe(expectedCarValue);
    });

    test('should return 200 and car value for model with special characters (C!v!c)', async () => {
        const model = "C!v!c"; // Model name has special symbols.
        const year = 2020;
        const expectedCarValue = calculateExpectedCarValue(model, year); // Symbols should not add to the value.
        const res = await request(app)
            .post('/api/car-value')
            .send({ model, year });
        expect(res.statusCode).toBe(200);
        expect(res.body.carValue).toBe(expectedCarValue);
    });

    test('should return 200 for a model containing only special characters and no letters', async () => {
        const model = "!@#$%"; // Model name has *only* special symbols, no letters.
        const year = 2020;
        const expectedCarValue = calculateExpectedCarValue(model, year); // Value should only come from base and year.
        const res = await request(app)
            .post('/api/car-value')
            .send({ model, year });
        expect(res.statusCode).toBe(200);
        expect(res.body.carValue).toBe(expectedCarValue);
    });

    // --- Negative Test Cases (These tests try sending "wrong" data to make sure the API shows errors correctly) ---

    test('should return 400 for missing model in request body', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ year: 2020 }); // Oops! We forgot to send the 'model' name.
        expect(res.statusCode).toBe(400); // We expect the API to say "Bad Request" (status code 400).
        expect(res.body.error).toBe("Missing 'model' parameter."); // We check the specific error message.
        expect(res.body.errorCode).toBe('E_MISSING_MODEL'); // And the special error code for missing model.
    });

    test('should return 400 for empty model string', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "", year: 2020 }); // The model name is there, but it's empty!
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Model cannot be empty.");
        expect(res.body.errorCode).toBe('E_EMPTY_MODEL');
    });

    test('should return 400 for model name as a number', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: 123, year: 2020 }); // The model name is a number, but it should be text!
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("'model' must be a string.");
        expect(res.body.errorCode).toBe('E_INVALID_MODEL_TYPE');
    });

    test('should return 400 for missing year in request body', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Civic" }); // Oops! We forgot to send the 'year'.
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Missing 'year' parameter.");
        expect(res.body.errorCode).toBe('E_MISSING_YEAR');
    });

    test('should return 400 for invalid year format (non-numeric string)', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Civic", year: "two thousand" }); // The year is text, but it should be a number!
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Invalid year format. Year must be an integer.');
        expect(res.body.errorCode).toBe('E_INVALID_YEAR_FORMAT');
    });

    test('should return 400 for a non-integer "year" (decimal)', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Civic", year: 2020.5 }); // The year is a decimal, but it should be a whole number!
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Invalid year format. Year must be an integer.');
        expect(res.body.errorCode).toBe('E_INVALID_YEAR_FORMAT');
    });

    test('should return 400 for negative year', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Civic", year: -100 }); // Cars can't be made in a negative year!
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Missing or invalid 'year' parameter. Year must be a positive integer.");
        expect(res.body.errorCode).toBe('E_INVALID_YEAR_VALUE');
    });

    test('should return 400 for a null "year"', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Civic", year: null }); // The year is 'null' (nothing), but it should be a number!
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Missing 'year' parameter.");
        expect(res.body.errorCode).toBe('E_MISSING_YEAR');
    });

    test('should return 400 for an empty request body (treated as missing model)', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({}); // We sent an empty message (empty object).
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Missing 'model' parameter."); // The API should say the model is missing.
        expect(res.body.errorCode).toBe('E_MISSING_MODEL');
    });

    test('should return 400 for a non-object single request body (e.g., string)', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send("not a json object"); // We sent plain text instead of a proper JSON message (object).
        expect(res.statusCode).toBe(400);
        // We expect this specific error message, which comes from how your API handles "bad" incoming messages.
        expect(res.body.error).toBe("Input must be a JSON object for a single car request.");
        // We expect this specific error code for a wrong type of input.
        expect(res.body.errorCode).toBe('E_INVALID_SINGLE_INPUT_TYPE');
    });

    // --- Batch Request Test Cases (These tests send a list (array) of cars at once) ---

    test('should return 400 and detailed results for mixed valid/invalid array input', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send([
                { model: "Civic", year: 2010 },      // This car's info is good!
                { model: "Porsche", year: "oops" },  // This car's year is wrong!
                { model: "Accord", year: 2020 },      // This car's info is good!
                null,                                // This item in the list is just 'null' (empty)!
                { model: "Ford", year: -50 }        // This car's year is negative!
            ]);

        expect(res.statusCode).toBe(400); // If even *one* car in the list has an error, the whole request gets a 400.
        expect(res.body.length).toBe(5); // But the API still sends back 5 results, one for each car you sent.

        // Check the report for the first car (Civic) - it should be good!
        expect(res.body[0].model).toBe("Civic");
        expect(res.body[0].carValue).toBe(calculateExpectedCarValue("Civic", 2010));
        expect(res.body[0].error).toBeUndefined(); // No error for this car.
        expect(res.body[0].errorCode).toBeUndefined();

        // Check the report for the second car (Porsche) - its year was wrong!
        expect(res.body[1].model).toBe("Porsche");
        expect(res.body[1].carValue).toBeUndefined(); // No value because of the error.
        expect(res.body[1].error).toBe("Invalid year format. Year must be an integer.");
        expect(res.body[1].errorCode).toBe('E_INVALID_YEAR_FORMAT');

        // Check the report for the third car (Accord) - it should be good!
        expect(res.body[2].model).toBe("Accord");
        expect(res.body[2].carValue).toBe(calculateExpectedCarValue("Accord", 2020));
        expect(res.body[2].error).toBeUndefined();
        expect(res.body[2].errorCode).toBeUndefined();

        // Check the report for the fourth item (null in array) - it was just empty!
        expect(res.body[3]).toEqual({
            error: "Each item in the batch must be a JSON object.",
            errorCode: 'E_INVALID_BATCH_ITEM_TYPE'
        });

        // Check the report for the fifth car (Ford) - its year was negative!
        expect(res.body[4].model).toBe("Ford");
        expect(res.body[4].carValue).toBeUndefined();
        expect(res.body[4].error).toBe("Missing or invalid 'year' parameter. Year must be a positive integer.");
        expect(res.body[4].errorCode).toBe('E_INVALID_YEAR_VALUE');
    });


    test('should return 200 and all results for an array input with all valid cars', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send([
                { model: "Civic", year: 2010 },
                { model: "Accord", year: 2020 }
            ]);

        expect(res.statusCode).toBe(200); // If *all* cars in the list are good, the whole request gets a 200.
        expect(res.body.length).toBe(2); // We sent 2 cars, so we expect 2 results.

        // Check the report for the first car (Civic) - it should be good!
        expect(res.body[0].model).toBe("Civic");
        expect(res.body[0].carValue).toBe(calculateExpectedCarValue("Civic", 2010));
        expect(res.body[0].error).toBeUndefined(); // No error!
        expect(res.body[0].errorCode).toBeUndefined();

        // Check the report for the second car (Accord) - it should be good!
        expect(res.body[1].model).toBe("Accord");
        expect(res.body[1].carValue).toBe(calculateExpectedCarValue("Accord", 2020));
        expect(res.body[1].error).toBeUndefined();
        expect(res.body[1].errorCode).toBeUndefined();
    });

});