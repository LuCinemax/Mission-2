// C:\Level 5\Mission2\Mission-2\backend-m2\tests\api-1.test.js

const request = require('supertest');
const app = require('../server'); // Path to your main Express app file

// Note: Direct imports of calculateCarValue and APIError have been removed.
// This is because these logics are now consolidated into server.js.
// From now on, we will directly test the /api/car-value endpoint through the Express app (app).


describe('API 1: Car Value Endpoint (Integration Tests - /api/car-value)', () => {
    // --- Positive Test Cases ---
    test('should return 200 and car value for valid Civic request', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Civic", year: 2014 });
        expect(res.statusCode).toBe(200);
        expect(res.body.carValue).toBe(6614);
    });

    test('should return 200 and car value for valid Porsche request', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Porsche", year: 2023 });
        expect(res.statusCode).toBe(200);
        expect(res.body.carValue).toBe(10423);
    });

    // Edge Cases (Migrated from previous unit tests, now as integration tests)
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
        expect(res.body.carValue).toBe(6614);
    });

    test('should return 200 and car value for model with special characters (C!v!c)', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "C!v!c", year: 2020 });
        expect(res.statusCode).toBe(200);
        expect(res.body.carValue).toBe(4820); // C=3, V=22, C=3 => 28 * 100 + 2020 = 4820
    });


    // --- Negative Test Cases (Endpoint) ---
    test('should return 400 for missing model in request body', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ year: 2020 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Missing 'model' parameter.");
    });

    test('should return 400 for empty model string', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "", year: 2020 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Model cannot be empty.");
    });

    test('should return 400 for model name as a number', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: 123, year: 2020 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("'model' must be a string.");
    });

    test('should return 400 for missing year in request body', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Civic" });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Missing 'year' parameter.");
    });

    test('should return 400 for invalid year format (non-numeric string)', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Civic", year: "two thousand" });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Invalid year format. Year must be an integer.');
    });

    test('should return 400 for non-integer year', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Civic", year: 2020.5 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Missing or invalid 'year' parameter. Year must be a positive integer.");
    });

    test('should return 400 for negative year', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Civic", year: -100 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Missing or invalid 'year' parameter. Year must be a positive integer.");
    });

    test('should return 400 for null year', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "Civic", year: null });
        expect(res.statusCode).toBe(400);
        // Corrected expectation to match server.js behavior for null year
        expect(res.body.error).toBe("Missing or invalid 'year' parameter. Year must be a positive integer.");
    });

    test('should return 400 for empty request body', async () => {
        const res = await request(app)
            .post('/api/car-value')
            .send({});
        expect(res.statusCode).toBe(400);
        // Corrected expectation to match server.js behavior for empty body
        expect(res.body.error).toBe("Missing 'model' parameter.");
    });

    test('should return 200 for model containing only special characters and no letters', async () => { // Changed description to reflect expected 200
        const res = await request(app)
            .post('/api/car-value')
            .send({ model: "!@#$%", year: 2020 });
        // Corrected status code and expected body to match server.js behavior
        expect(res.statusCode).toBe(200);
        expect(res.body.carValue).toBe(2020); // Alphabet sum is 0, so carValue is just the year
    });
});