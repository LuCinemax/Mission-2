const request = require('supertest');
const app = require('../server'); // Path to your Express app

// Starting the Test Suite for API 1: Car Value Endpoint
describe('API 1: Car Value Endpoint (Integration Tests - /api/car-value)', () => {

    /**
     * Helper function to calculate the expected car value based on the new logic.
     * This function should mirror the calculation logic in your actual car valuation service.
     * @param {string} model - The car model name.
     * @param {number} year - The car year.
     * @returns {number} The calculated car value.
     */
    const calculateExpectedCarValue = (model, year) => {
        // Calculate modelFactor by summing the alphabetical position of each letter.
        // Non-alphabetic characters are ignored. Case-insensitive.
        const modelFactor = model.toLowerCase().split('').reduce((sum, char) => {
            if (char >= 'a' && char <= 'z') {
                return sum + (char.charCodeAt(0) - 'a'.charCodeAt(0) + 1); // 'a' is 1, 'b' is 2, etc.
            }
            return sum; // If it's not a letter (like '!' or numbers), add nothing to the sum.
        }, 0); // Start counting from zero.

        // Apply the new calculation logic: (modelFactor * 100) + year
        let carValue = (modelFactor * 100) + year;

        // Ensure the car value is never negative
        return Math.max(0, carValue);
    };

    // --- Positive / Sunny Day Scenarios (Single Car Request) ---

    // Test 1: Standard valid input (Civic, 2014)
    test('should return 200 and car value for valid Civic request', async () => {
        const model = 'Civic';
        const year = 2014;
        const expectedCarValue = calculateExpectedCarValue(model, year); // Calculate expected value

        const res = await request(app)
            .post('/api/car-value')
            .send({ model, year });
        
        expect(res.statusCode).toEqual(200); // Expect a successful response (200 OK)
        expect(res.body.carValue).toBe(expectedCarValue); // Expect the calculated car value to match
    });

    // Test 2: Valid input, different model and year (Porsche, 2023)
    test('should return 200 and car value for valid Porsche request', async () => {
        const model = 'Porsche';
        const year = 2023;
        const expectedCarValue = calculateExpectedCarValue(model, year);

        const res = await request(app)
            .post('/api/car-value')
            .send({ model, year });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.carValue).toBe(expectedCarValue);
    });

    // Test 3: Model is a single letter (A, 2000)
    test('should return 200 and car value for model with a single letter (A)', async () => {
        const model = 'A';
        const year = 2000;
        const expectedCarValue = calculateExpectedCarValue(model, year);

        const res = await request(app)
            .post('/api/car-value')
            .send({ model, year });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.carValue).toBe(expectedCarValue);
    });

    // Test 4: Model with mixed casing (cIvIc, 2014)
    test('should return 200 and car value for model with mixed casing (cIvIc)', async () => {
        const model = 'cIvIc';
        const year = 2014;
        const expectedCarValue = calculateExpectedCarValue(model, year); // Model factor is case-insensitive

        const res = await request(app)
            .post('/api/car-value')
            .send({ model, year });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.carValue).toBe(expectedCarValue);
    });

    // Test 5: Model with special characters (C!v!c, 2020)
    test('should return 200 and car value for model with special characters (C!v!c)', async () => {
        const model = 'C!v!c';
        const year = 2020;
        const expectedCarValue = calculateExpectedCarValue(model, year); // Only alphabetic chars count

        const res = await request(app)
            .post('/api/car-value')
            .send({ model, year });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.carValue).toBe(expectedCarValue);
    });

    // Test 6: Model containing only non-alphabetic characters (e.g., "123!@#$", 2020)
    test('should return 200 for a model containing only special characters and no letters', async () => {
        const model = '123!@#$';
        const year = 2020;
        const expectedCarValue = calculateExpectedCarValue(model, year); // Model factor will be 0

        const res = await request(app)
            .post('/api/car-value')
            .send({ model, year });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.carValue).toBe(expectedCarValue);
    });

    // --- Negative / Error Scenarios (Single Car Request) ---
    // These tests verify that the API correctly handles invalid inputs and returns appropriate error codes.

    // Test 7: Missing 'model' parameter in the request body
    test('should return 400 for missing model in request body', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ year: 2020 });
        expect(res.statusCode).toEqual(400); // Expect a bad request status (400)
        expect(res.body.error).toEqual("Missing 'model' parameter.");
        expect(res.body.errorCode).toEqual("E_MISSING_MODEL");
    });

    // Test 8: Empty 'model' string in the request body
    test('should return 400 for empty model string', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: '', year: 2020 });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual("Model cannot be empty.");
        expect(res.body.errorCode).toEqual("E_EMPTY_MODEL");
    });

    // Test 9: 'model' parameter is a number (invalid type, should be string)
    test('should return 400 for model name as a number', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: 123, year: 2020 });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual("'model' must be a string.");
        expect(res.body.errorCode).toEqual("E_INVALID_MODEL_TYPE");
    });

    // Test 10: Missing 'year' parameter
    test('should return 400 for missing year in request body', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: 'Civic' });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual("Missing 'year' parameter.");
        expect(res.body.errorCode).toEqual("E_MISSING_YEAR");
    });

    // Test 11: 'year' parameter is a non-numeric string (invalid format)
    test('should return 400 for invalid year format (non-numeric string)', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: 'Civic', year: 'invalid year' });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual("Invalid year format. Year must be an integer.");
        expect(res.body.errorCode).toEqual("E_INVALID_YEAR_FORMAT");
    });

    // Test 12: 'year' parameter is a decimal number (invalid format)
    test('should return 400 for a non-integer "year" (decimal)', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: 'Civic', year: 2020.5 });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual("Invalid year format. Year must be an integer.");
        expect(res.body.errorCode).toEqual("E_INVALID_YEAR_FORMAT");
    });

    // Test 13: 'year' parameter is a negative number
    test('should return 400 for negative year', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: 'Civic', year: -100 });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual("Missing or invalid 'year' parameter. Year must be a positive integer.");
        expect(res.body.errorCode).toEqual("E_INVALID_YEAR_VALUE");
    });

    // Test 14: 'year' parameter is null
    test('should return 400 for a null "year"', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: 'Civic', year: null });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual("Missing 'year' parameter.");
        expect(res.body.errorCode).toEqual("E_MISSING_YEAR");
    });

    // Test 15: Empty request body
    test('should return 400 for an empty request body (treated as missing model)', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual("Missing 'model' parameter.");
        expect(res.body.errorCode).toEqual("E_MISSING_MODEL");
    });

    // Test 16: Request body is not an object (e.g., string)
    test('should return 400 for a non-object single request body (e.g., string)', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send('not an object'); // Send a string instead of an object
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual("Input must be a JSON object for a single car request.");
        expect(res.body.errorCode).toEqual("E_INVALID_SINGLE_INPUT_TYPE");
    });

    // --- Batch / Array Input Scenarios ---

    // Test 17: Array input with all valid cars
    test('should return 200 and all results for an array input with all valid cars', async () => {
        const requests = [
            { model: 'Civic', year: 2010 },
            { model: 'Accord', year: 2020 }
        ];
        const res = await request(app)
            .post('/api/car-value')
            .send(requests);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);

        // Assertions for the first car (Civic)
        expect(res.body[0].carValue).toBe(calculateExpectedCarValue('Civic', 2010));
        expect(res.body[0].model).toBe('Civic');
        expect(res.body[0].year).toBe(2010);
        expect(res.body[0].error).toBeUndefined();
        expect(res.body[0].errorCode).toBeUndefined();

        // Assertions for the second car (Accord)
        expect(res.body[1].carValue).toBe(calculateExpectedCarValue('Accord', 2020));
        expect(res.body[1].model).toBe('Accord');
        expect(res.body[1].year).toBe(2020);
        expect(res.body[1].error).toBeUndefined();
        expect(res.body[1].errorCode).toBeUndefined();
    });

    // Test 18: Array input with mixed valid/invalid data
    test('should return 400 and detailed results for mixed valid/invalid array input', async () => {
        const requests = [
            { model: 'Civic', year: 2020 },       // Valid input
            { model: 'Camry', year: 'invalid' },  // Invalid year format
            { model: 'Accord', year: 2020 },      // Valid input
            { model: '', year: 2021 },            // Empty model string
            null                                  // Invalid batch item type (should be an object)
        ];
        const res = await request(app)
            .post('/api/car-value')
            .send(requests);
        
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveLength(5);

        // Result 1: Valid Civic
        expect(res.body[0]).toEqual({ 
            model: 'Civic', 
            year: 2020, 
            carValue: calculateExpectedCarValue('Civic', 2020) 
        });

        // Result 2: Invalid year format for Camry
        expect(res.body[1]).toEqual({
            model: 'Camry',
            year: 'invalid',
            error: "Invalid year format. Year must be an integer.",
            errorCode: "E_INVALID_YEAR_FORMAT"
        });

        // Result 3: Valid Accord
        expect(res.body[2]).toEqual({ 
            model: 'Accord', 
            year: 2020, 
            carValue: calculateExpectedCarValue('Accord', 2020) 
        });

        // Result 4: Empty model for empty string input - UPDATED EXPECTATION
        expect(res.body[3]).toEqual({
            model: '',
            year: 2021, // <-- Added this line to match API response
            error: "Model cannot be empty.",
            errorCode: "E_EMPTY_MODEL"
        });

        // Result 5: Invalid batch item type for null input
        expect(res.body[4]).toEqual({
            error: "Each item in the batch must be a JSON object.",
            errorCode: "E_INVALID_BATCH_ITEM_TYPE"
        });
    });

    // Test case: Empty array input
    test('should return 200 and an empty array for an empty array input', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send([]);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });

});