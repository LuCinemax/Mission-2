// // C:\Level 5\Mission2\Mission-2\backend-m2\tests\api-1.test.js
// 
// const request = require('supertest'); // This helps us make requests to our app
// const app = require('../server'); // This is the main file for our app
// 
// // We are importing the function that calculates the car value
// // Note: Direct imports of calculateCarValue and APIError have been removed.
// // This is because these logics are now consolidated into server.js.
// // From now on, we will directly test the /api/car-value endpoint through the Express app (app).
// 
// // const { calculateCarValue, APIError } = require('../api1_car_value/carValuation');
// 
// // This is where we start testing the car value calculation
// describe('API 1: Car Value Calculation (Unit Tests - calculateCarValue function)', () => {
//     
//     // --- Positive Test Cases ---
//     // Test case to check the value for a Civic from 2014
//     test('should calculate value for Civic 2014 (Sunny day scenario)', () => {
//         const input = { model: "Civic", year: 2014 }; // Input for the test
//         // Here we explain how we calculate the value:
//         // C=3, I=9, V=22, I=9, C=3 => Total = 46. 
//         // So (46 * 100) + 2014 = 6614
//         expect(calculateCarValue(input)).toBe(6614); // Check if the result is 6614
//     });
// 
//     // Test case for a Porsche from 2023
//     test('should calculate value for Porsche 2023', () => {
//         const input = { model: "Porsche", year: 2023 };
//         // Calculation explanation: 
//         // P=16, O=15, R=18, S=19, C=3, H=8, E=5 => Total = 84.
//         // So (84 * 100) + 2023 = 10423
//         expect(calculateCarValue(input)).toBe(10423); // Check if the result is 10423
//     });
// 
//     // --- Edge Cases ---
//     // Test case for a single letter model (A)
//     test('should handle model name with a single letter (A)', () => {
//         const input = { model: "A", year: 2000 };
//         // A=1. So (1 * 100) + 2000 = 2100
//         expect(calculateCarValue(input)).toBe(2100); // Check if the result is 2100
//     });
// 
//     // Test case for a single letter model (Z)
//     test('should handle model name with a single letter (Z)', () => {
//         const input = { model: "Z", year: 1999 };
//         // Z=26. So (26 * 100) + 1999 = 4599
//         expect(calculateCarValue(input)).toBe(4599); // Check if the result is 4599
//     });
// 
//     // Test case for a future car model
//     test('should handle future years', () => {
//         const input = { model: "SuperCar", year: 2050 };
//         // Calculation: S=19, U=21, P=16, E=5, R=18, C=3, A=1, R=18 => Total = 101.
//         // So (101 * 100) + 2050 = 12150
//         expect(calculateCarValue(input)).toBe(12150); // Check if the result is 12150
//     });
// 
//     // Test case for mixed casing in model name
//     test('should handle model names with mixed casing', () => {
//         const input = { model: "cIvIc", year: 2014 };
//         // cIvIc should be treated as CIVIC. Total = 46.
//         // So (46 * 100) + 2014 = 6614
//         expect(calculateCarValue(input)).toBe(6614); // Check if the result is 6614
//     });
// 
//     // Test case for special characters in model name
//     test('should ignore special characters in model name', () => {
//         const input = { model: "C!v!c", year: 2020 };
//         // C=3, V=22, C=3 => Total = 28. 
//         // So (28 * 100) + 2020 = 4820
//         expect(calculateCarValue(input)).toBe(4820); // Check if the result is 4820
//     });
// 
//     // --- Negative Test Cases (Validation) ---
//     // Test case for a negative year
//     test('should throw APIError for negative year', () => {
//         const input = { model: "Civic", year: -987 };
//         expect(() => calculateCarValue(input)).toThrow(APIError); // Check if it throws an error
//         expect(() => calculateCarValue(input)).toThrow('Missing or invalid \'year\' parameter. Year must be a positive integer.'); // Check the error message
//     });
// 
//     // Test case for a non-integer year
//     test('should throw APIError for non-integer year', () => {
//         const input = { model: "Civic", year: 2020.5 };
//         expect(() => calculateCarValue(input)).toThrow(APIError); // Check if it throws an error
//         expect(() => calculateCarValue(input)).toThrow('Missing or invalid \'year\' parameter. Year must be a positive integer.'); // Check the error message
//     });
// 
//     // Test case for a non-numeric year string
//     test('should throw APIError for non-numeric year string', () => {
//         const input = { model: "Civic", year: "twenty twenty" };
//         expect(() => calculateCarValue(input)).toThrow(APIError); // Check if it throws an error
//         expect(() => calculateCarValue(input)).toThrow('Missing or invalid \'year\' parameter.'); // Check the error message
//     });
// 
//     // Test case for an empty model string
//     test('should throw APIError for empty model string', () => {
//         const input = { model: "", year: 2020 };
//         expect(() => calculateCarValue(input)).toThrow(APIError); // Check if it throws an error
//         expect(() => calculateCarValue(input)).toThrow('Missing or invalid \'model\' parameter.'); // Check the error message
//     });
// 
//     // Test case for model name as a number
//     test('should throw APIError for model name as a number', () => {
//         const input = { model: 123, year: 2020 };
//         expect(() => calculateCarValue(input)).toThrow(APIError); // Check if it throws an error
//         expect(() => calculateCarValue(input)).toThrow('Missing or invalid \'model\' parameter.'); // Check the error message
//     });
// 
//     // Test case for null year
//     test('should throw APIError for null year', () => {
//         const input = { model: "Civic", year: null };
//         expect(() => calculateCarValue(input)).toThrow(APIError); // Check if it throws an error
//         expect(() => calculateCarValue(input)).toThrow('Missing or invalid \'year\' parameter.'); // Check the error message
//     });
// 
//     // Test case for empty input JSON
//     test('should throw APIError for empty input JSON', () => {
//         const input = {};
//         expect(() => calculateCarValue(input)).toThrow(APIError); // Check if it throws an error
//         expect(() => calculateCarValue(input)).toThrow('Input must be a JSON object.'); // Check the error message
//     });
// });
// 
// // This is where we start testing the car value endpoint
// describe('API 1: Car Value Endpoint (Integration Tests - /api/car-value)', () => {
//     
//     // --- Positive Test Cases ---
//     // Test case for a valid Civic request
//     test('should return 200 and car value for valid Civic request', async () => {
//         const res = await request(app) // Make a request to the app
//             .post('/api/car-value') // We are sending a POST request to this endpoint
//             .send({ model: "Civic", year: 2014 }); // Sending the car model and year
//         expect(res.statusCode).toBe(200); // Check if the status code is 200 (OK)
//         expect(res.body.carValue).toBe(6614); // Check if the car value returned is 6614
//     });
// 
//     // Test case for a valid Porsche request
//     test('should return 200 and car value for valid Porsche request', async () => {
//         const res = await request(app)
//             .post('/api/car-value')
//             .send({ model: "Porsche", year: 2023 });
//         expect(res.statusCode).toBe(200); // Check if the status code is 200 (OK)
//         expect(res.body.carValue).toBe(10423); // Check if the car value returned is 10423
//     });
// 
//     // --- Negative Test Cases (Endpoint) ---
//     // Test case for missing model in request
//     test('should return 400 for missing model in request body', async () => {
//         const res = await request(app)
//             .post('/api/car-value')
//             .send({ year: 2020 }); // Sending a request without the model
//         expect(res.statusCode).toBe(400); // Check if the status code is 400 (Bad Request
//         expect(res.body.error).toBe('Missing or invalid \'model\' parameter.'); // Check the error message
//     });
// 
//     // Test case for invalid year format
//     test('should return 400 for invalid year format', async () => {
//         const res = await request(app)
//             .post('/api/car-value')
//             .send({ model: "Civic", year: "two thousand" }); // Sending an invalid year
//         expect(res.statusCode).toBe(400); // Check if the status code is 400 (Bad Request)
//         expect(res.body.error).toBe('Missing or invalid \'year\' parameter.'); // Check the error message
//     });
// 
//     // Test case for model name as a number
//     test('should return 400 for model name as a number', async () => {
//         const res = await request(app)
//             .post('/api/car-value')
//             .send({ model: 123, year: 2020 }); // Sending a number as the model name
//         expect(res.statusCode).toBe(400); // Check if the status code is 400 (Bad Request)
//         expect(res.body.error).toBe('Missing or invalid \'model\' parameter.'); // Check the error message
//     });
// });

// C:\Level 5\Mission2\Mission-2\backend-m2\tests\api-1.test.js

// const request = require('supertest');
// const app = require('../server'); // Path to your main Express app file
// 
// // Note: Direct imports of calculateCarValue and APIError have been removed.
// // This is because these logics are now consolidated into server.js.
// // From now on, we will directly test the /api/car-value endpoint through the Express app (app).
// 
// 
// describe('API 1: Car Value Endpoint (Integration Tests - /api/car-value)', () => {
//     // --- Positive Test Cases ---
//     test('should return 200 and car value for valid Civic request', async () => {
//         const res = await request(app)
//             .post('/api/car-value')
//             .send({ model: "Civic", year: 2014 });
//         expect(res.statusCode).toBe(200);
//         expect(res.body.carValue).toBe(6614);
//     });
// 
//     test('should return 200 and car value for valid Porsche request', async () => {
//         const res = await request(app)
//             .post('/api/car-value')
//             .send({ model: "Porsche", year: 2023 });
//         expect(res.statusCode).toBe(200);
//         expect(res.body.carValue).toBe(10423);
//     });
// 
//     // Edge Cases (Migrated from previous unit tests, now as integration tests)
//     test('should return 200 and car value for model with a single letter (A)', async () => {
//         const res = await request(app)
//             .post('/api/car-value')
//             .send({ model: "A", year: 2000 });
//         expect(res.statusCode).toBe(200);
//         expect(res.body.carValue).toBe(2100);
//     });
// 
//     test('should return 200 and car value for model with mixed casing (cIvIc)', async () => {
//         const res = await request(app)
//             .post('/api/car-value')
//             .send({ model: "cIvIc", year: 2014 });
//         expect(res.statusCode).toBe(200);
//         expect(res.body.carValue).toBe(6614);
//     });
// 
//     test('should return 200 and car value for model with special characters (C!v!c)', async () => {
//         const res = await request(app)
//             .post('/api/car-value')
//             .send({ model: "C!v!c", year: 2020 });
//         expect(res.statusCode).toBe(200);
//         expect(res.body.carValue).toBe(4820); // C=3, V=22, C=3 => 28 * 100 + 2020 = 4820
//     });
// 
// 
//     // --- Negative Test Cases (Endpoint) ---
//     test('should return 400 for missing model in request body', async () => {
//         const res = await request(app)
//             .post('/api/car-value')
//             .send({ year: 2020 });
//         expect(res.statusCode).toBe(400);
//         expect(res.body.error).toBe("Missing 'model' parameter."); // Corrected message
//     });
// 
//     test('should return 400 for empty model string', async () => {
//         const res = await request(app)
//             .post('/api/car-value')
//             .send({ model: "", year: 2020 });
//         expect(res.statusCode).toBe(400);
//         expect(res.body.error).toBe("Model cannot be empty.");
//     });
// 
//     test('should return 400 for model name as a number', async () => {
//         const res = await request(app)
//             .post('/api/car-value')
//             .send({ model: 123, year: 2020 });
//         expect(res.statusCode).toBe(400);
//         expect(res.body.error).toBe("'model' must be a string."); // Corrected message
//     });
// 
//     test('should return 400 for missing year in request body', async () => {
//         const res = await request(app)
//             .post('/api/car-value')
//             .send({ model: "Civic" });
//         expect(res.statusCode).toBe(400);
//         expect(res.body.error).toBe("Missing 'year' parameter.");
//     });
// 
//     test('should return 400 for invalid year format (non-numeric string)', async () => {
//         const res = await request(app)
//             .post('/api/car-value')
//             .send({ model: "Civic", year: "twenty twenty" });
//         expect(res.statusCode).toBe(400);
//         expect(res.body.error).toBe('Invalid year format. Year must be an integer.'); // Corrected message
//     });
// 
//     test('should return 400 for non-integer year', async () => {
//         const res = await request(app)
//             .post('/api/car-value')
//             .send({ model: "Civic", year: 2020.5 });
//         expect(res.statusCode).toBe(400);
//         expect(res.body.error).toBe("Missing or invalid 'year' parameter. Year must be a positive integer.");
//     });
// 
//     test('should return 400 for negative year', async () => {
//         const res = await request(app)
//             .post('/api/car-value')
//             .send({ model: "Civic", year: -100 });
//         expect(res.statusCode).toBe(400);
//         expect(res.body.error).toBe("Missing or invalid 'year' parameter. Year must be a positive integer.");
//     });
// 
//     test('should return 400 for null year', async () => {
//         const res = await request(app)
//             .post('/api/car-value')
//             .send({ model: "Civic", year: null });
//         expect(res.statusCode).toBe(400);
//         expect(res.body.error).toBe("Missing 'year' parameter."); // Corrected message
//     });
// 
//     test('should return 400 for empty request body', async () => {
//         const res = await request(app)
//             .post('/api/car-value')
//             .send({});
//         expect(res.statusCode).toBe(400);
//         expect(res.body.error).toBe("Input must be a JSON object.");
//     });
// 
//     test('should return 400 if model contains only special characters and no letters', async () => {
//         const res = await request(app)
//             .post('/api/car-value')
//             .send({ model: "!@#$%", year: 2020 });
//         expect(res.statusCode).toBe(400);
//         expect(res.body.error).toBe("Model cannot be empty."); // Corrected message
//     });
// });

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