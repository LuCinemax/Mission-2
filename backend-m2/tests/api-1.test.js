// C:\Level 5\Mission2\Mission-2\backend-m2\tests\api-1.test.js

const request = require('supertest'); // Supertest for making HTTP requests to the Express app
// Import your main Express application instance
const app = require('../server'); // Path to your main Express app file

// Note: Direct imports of calculateCarValue and APIError have been removed.
// This is because these logics are now consolidated into server.js.
// From now on, we will directly test the /api/car-value endpoint through the Express app (app).

// Calculating car values for valid inputs.
// Handling edge cases for model names (single letter, mixed casing, special characters).
// Returning appropriate 400 Bad Request errors with specific error messages and codes
// for invalid or missing inputs (like missing model/year, invalid year format, negative year, empty strings, etc.).
// Processing batch requests (arrays of cars), correctly calculating valid entries,
// and returning detailed errors for invalid ones within the batch.
describe('API 1: Car Value Endpoint (Integration Tests - /api/car-value)', () => {
    
    // --- Positive Test Cases (Single Car Request) ---
    // These tests verify that the API returns correct car values for valid inputs.
    test('should return 200 and car value for valid Civic request', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Civic", year: 2014 }); // Send request body
        expect(res.statusCode).toBe(200); // Expect HTTP 200 OK
        expect(res.body.carValue).toBe(6614); // Assert the calculated car value
    });

    test('should return 200 and car value for valid Porsche request', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Porsche", year: 2023 });
        expect(res.statusCode).toBe(200);
        expect(res.body.carValue).toBe(10423);
    });

    
    // --- Edge Cases (Single Car Request) ---
    // These tests cover specific scenarios for model and year inputs.
    test('should return 200 and car value for model with a single letter (A)', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "A", year: 2000 });
        expect(res.statusCode).toBe(200);
        expect(res.body.carValue).toBe(2100);
    });

    test('should return 200 and car value for model with mixed casing (cIvIc)', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "cIvIc", year: 2014 });
        expect(res.statusCode).toBe(200);
        expect(res.body.carValue).toBe(6614); // Should treat "cIvIc" same as "CIVIC"
    });

    test('should return 200 and car value for model with special characters (C!v!c)', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "C!v!c", year: 2020 });
        expect(res.statusCode).toBe(200);
        // C=3, i (ignored), v=22, ! (ignored), c=3 => (3+22+3) * 100 + 2020 = 2800 + 2020 = 4820
        expect(res.body.carValue).toBe(4820); 
    });

    // added from initial setting
    test('should return 200 for a model containing only special characters and no letters', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "!@#$%", year: 2020 });
        expect(res.statusCode).toBe(200);
        expect(res.body.carValue).toBe(2020); // Alphabet sum is 0, so carValue is just the year
    });

    
    // --- Negative Test Cases (Single Car Request) ---
    // These tests verify that the API correctly handles invalid or missing inputs and returns 400 errors.

    test('should return 400 for missing model in request body', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ year: 2020 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Missing 'model' parameter.");
        expect(res.body.errorCode).toBe('E_MISSING_MODEL'); // Assert specific error code
    });

    test('should return 400 for empty model string', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "", year: 2020 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Model cannot be empty.");
        expect(res.body.errorCode).toBe('E_EMPTY_MODEL');
    });

    test('should return 400 for model name as a number', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: 123, year: 2020 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("'model' must be a string.");
        expect(res.body.errorCode).toBe('E_INVALID_MODEL_TYPE');
    });

    test('should return 400 for missing year in request body', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Civic" });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Missing 'year' parameter.");
        expect(res.body.errorCode).toBe('E_MISSING_YEAR');
    });

    test('should return 400 for invalid year format (non-numeric string)', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Civic", year: "two thousand" });
        expect(res.statusCode).toBe(400);
        //corrected
        expect(res.body.error).toBe('Year must be a positive integer. Invalid format.');
        expect(res.body.errorCode).toBe('E_INVALID_YEAR_FORMAT');
    });

    //added from initail setting
    test('should return 400 for a non-integer "year" (decimal)', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Civic", year: 2020.5 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Invalid 'year' parameter. 'year' must be an integer (no decimals).");
        expect(res.body.errorCode).toBe('E_INVALID_YEAR_VALUE');
    });

    test('should return 400 for negative year', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Civic", year: -100 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Invalid 'year' parameter. 'year' must be a positive integer (greater than 0).");
        expect(res.body.errorCode).toBe('E_INVALID_YEAR_VALUE');
    });

    test('should return 400 for a null "year"', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Civic", year: null });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Invalid 'year' parameter. 'year' cannot be null.");
        expect(res.body.errorCode).toBe('E_INVALID_YEAR_VALUE');
    });

    test('should return 400 for empty request body', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({});
        expect(res.statusCode).toBe(400);
        // Corrected expectation to match server.js behavior for empty body
        expect(res.body.error).toBe("Missing 'model' parameter.");
        expect(res.body.errorCode).toBe('E_MISSING_MODEL');
    });

    // --- Negative Test Cases (Single Car Request) ---
    // These tests verify that the API correctly handles invalid or missing inputs and returns 400 errors.

    test('should return 400 for a missing "model" parameter in request body', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ year: 2020 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Missing 'model' parameter.");
        expect(res.body.errorCode).toBe('E_MISSING_MODEL'); // Assert specific error code
    });

    test('should return 400 for an empty "model" string', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "", year: 2020 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Model cannot be empty.");
        expect(res.body.errorCode).toBe('E_EMPTY_MODEL');
    });

    test('should return 400 for "model" name as a number', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: 123, year: 2020 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("'model' must be a string.");
        expect(res.body.errorCode).toBe('E_INVALID_MODEL_TYPE');
    });

    test('should return 400 for a missing "year" parameter in request body', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Civic" });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Missing 'year' parameter.");
        expect(res.body.errorCode).toBe('E_MISSING_YEAR');
    });

    test('should return 400 for invalid "year" format (non-numeric string)', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Civic", year: "two thousand" });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Year must be a positive integer. Invalid format.');
        expect(res.body.errorCode).toBe('E_INVALID_YEAR_FORMAT');
    });

    test('should return 400 for a non-integer "year" (decimal)', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Civic", year: 2020.5 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Invalid 'year' parameter. 'year' must be an integer (no decimals).");
        expect(res.body.errorCode).toBe('E_INVALID_YEAR_VALUE');
    });

    test('should return 400 for a negative "year"', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Civic", year: -100 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Invalid 'year' parameter. 'year' must be a positive integer (greater than 0).");
        expect(res.body.errorCode).toBe('E_INVALID_YEAR_VALUE');
    });

    test('should return 400 for a null "year"', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Civic", year: null });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Invalid 'year' parameter. 'year' cannot be null.");
        expect(res.body.errorCode).toBe('E_INVALID_YEAR_VALUE');
    });

    test('should return 400 for an empty request body', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Missing 'model' parameter.");
        expect(res.body.errorCode).toBe('E_MISSING_MODEL');
    });

    // --- Batch Request Test Cases (Array Input) ---
    // These tests verify the API's behavior when an array of car objects is sent.

    test('should return 400 and detailed results for mixed valid/invalid array input', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send([
                { model: "Civic", year: 2010 },      // Valid item
                { model: "Porsche", year: "oops" },  // Invalid year format
                { model: "Accord", year: 2020 }      // Valid item
            ]);

        expect(res.statusCode).toBe(400); // Overall status is 400 because at least one item failed
        expect(res.body.length).toBe(3); // Ensure all three items are in the response

        // Assertions for the first (valid) item
        expect(res.body[0].model).toBe("Civic");
        expect(res.body[0].carValue).toBe(6610);
        expect(res.body[0].error).toBeUndefined(); // No error for this item
        expect(res.body[0].errorCode).toBeUndefined();

        // Assertions for the second (invalid) item
        expect(res.body[1].model).toBe("Porsche");
        expect(res.body[1].carValue).toBeUndefined(); // No carValue for failed item
        // you were expecting an errorCode of 'E_INVALID_YEAR_FORMAT' for the second item in the batch (res.body[1]),
        // but the response didn't have an errorCode property at all (undefined).
        expect(res.body[1].error).toBe("Year must be a positive integer. Invalid format.");
        expect(res.body[1].errorCode).toBe('E_INVALID_YEAR_FORMAT'); // Assert specific error code

        // Assertions for the third (valid) item
        expect(res.body[2].model).toBe("Accord");
        // This correction aligns the test's expectation with the actual and correct calculation for "Accord"
        // (Alphabet Sum 44 * 100 + 2020 Year = 6420).
        expect(res.body[2].carValue).toBe(6420);
        expect(res.body[2].error).toBeUndefined();
        expect(res.body[2].errorCode).toBeUndefined();
    });

    test('should return 200 and all results for an array input with all valid cars', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send([
                { model: "Civic", year: 2010 },
                { model: "Accord", year: 2020 }
            ]);

        expect(res.statusCode).toBe(200); // Overall status is 200 as all items are valid
        expect(res.body.length).toBe(2);

        // Assertions for the first item
        expect(res.body[0].model).toBe("Civic");
        expect(res.body[0].carValue).toBe(6610);

        // Assertions for the second item
        expect(res.body[1].model).toBe("Accord");
        expect(res.body[1].carValue).toBe(6420);
    });

});