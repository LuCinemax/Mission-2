const supertest = require("supertest");
const app = require("../server");

const request = supertest(app);

describe("POST /api/calculateDiscount Discount Rate API", () => {
  ////////////////////// --- POSITIVE TEST CASES --- //////////////////////////
  describe("Positive Test cases (Expexted Discounts)", () => {
    test("should return 0% for age 20 and experience 3 (initial filter)", async () => {
      const response = await request.post("/api/calculateDiscount").send({
        age: 20,
        yearsOfExperience: 3,
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.discount).toBe(0); // Expect 0 due to age <= 25 and exp <= 5
    });

    test("should return 0% discount for a young driver with high experience (age 20, exp 10)", async () => {
      const response = await request
        .post("/api/calculateDiscount")
        .send({ age: 20, yearsOfExperience: 10 });
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ discount: 0 }); // Expect 0, because age <= 25
    });

    test("should return 10% discount for an older driver with little experience (age 30, exp 5)", async () => {
      const response = await request
        .post("/api/calculateDiscount")
        .send({ age: 30, yearsOfExperience: 5 });
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ discount: 10 }); 
    });

    test("should return 10% for age 30 and experience 6", async () => {
      const response = await request.post("/api/calculateDiscount").send({
        age: 30,
        yearsOfExperience: 6,
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.discount).toBe(10); // 5 (age>=25) + 5 (exp>=5)
    });

    test("should return 10% for age 35 and experience 8", async () => {
      const response = await request.post("/api/calculateDiscount").send({
        age: 35,
        yearsOfExperience: 8,
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.discount).toBe(10); // 5 (age>=25) + 5 (exp>=5)
    });

    test("should return 15% for age 40 and experience 6", async () => {
      const response = await request.post("/api/calculateDiscount").send({
        age: 40,
        yearsOfExperience: 6,
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.discount).toBe(15); // 5 (age>=25) + 5 (exp>=5) + 5 (age>=40)
    });

    test("should return 15% for age 30 and experience 10", async () => {
      const response = await request.post("/api/calculateDiscount").send({
        age: 30,
        yearsOfExperience: 10,
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.discount).toBe(15); // 5 (age>=25) + 5 (exp>=5) + 5 (exp>=10)
    });

    test("should return 20% for age 40 and experience 10 (maximum discount)", async () => {
      const response = await request.post("/api/calculateDiscount").send({
        age: 40,
        yearsOfExperience: 10,
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.discount).toBe(20); // 5+5+5+5 = 20
    });

    test("should return 20% for age 45 and experience 15 (capped)", async () => {
      const response = await request.post("/api/calculateDiscount").send({
        age: 45,
        yearsOfExperience: 15,
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.discount).toBe(20); // Should be 20 (capped)
    });

    test("should return 20% discount for very high values (should not exceed max)", async () => {
      const response = await request
        .post("/api/calculateDiscount")
        .send({ age: 80, yearsOfExperience: 30 });
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ discount: 20 });
    });
  });

  //////////////////// --- NEGATIVE TEST CASES --- //////////////////////////

  describe("Negative Test Cases (Error Handling)", () => {
    // Separate block for missing parameters
    describe("Missing Parameters", () => {
      test("should return 400 for missing age parameter", async () => {
        const response = await request
          .post("/api/calculateDiscount")
          .send({ yearsOfExperience: 10 });
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual({
          error: "Invalid input: age and yearsOfExperience must be numbers.",
        });
      });

      test("should return 400 for missing yearsOfExperience parameter", async () => {
        const response = await request.post("/api/calculateDiscount").send({ age: 30 });
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual({
          error: "Invalid input: age and yearsOfExperience must be numbers.",
        });
      });
    });

    // Separate block for non-numeric types (including null/undefined)
    describe("Non-Numeric/Invalid Types", () => {
      test("should return 400 for non-numeric age (string)", async () => {
        const response = await request
          .post("/api/calculateDiscount")
          .send({ age: "thirty", yearsOfExperience: 10 });
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual({
          error: "Invalid input: age and yearsOfExperience must be numbers.",
        });
      });

      test("should return 400 for non-numeric yearsOfExperience (boolean)", async () => {
        const response = await request
          .post("/api/calculateDiscount")
          .send({ age: 30, yearsOfExperience: true });
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual({
          error: "Invalid input: age and yearsOfExperience must be numbers.",
        });
      });

      test("should return 400 for null age", async () => {
        const response = await request
          .post("/api/calculateDiscount")
          .send({ age: null, yearsOfExperience: 10 });
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual({
          error: "Invalid input: age and yearsOfExperience must be numbers.",
        });
      });

      test("should return 400 for undefined yearsOfExperience", async () => {
        const response = await request
          .post("/api/calculateDiscount")
          .send({ age: 30, yearsOfExperience: undefined });
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual({
          error: "Invalid input: age and yearsOfExperience must be numbers.",
        });
      });
    });

    // Separate block for negative values
    describe("Negative Numeric Values", () => {
      test("should return 400 for negative age", async () => {
        const response = await request
          .post("/api/calculateDiscount")
          .send({ age: -5, yearsOfExperience: 10 });
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual({
          error:
            "Invalid input: age and yearsOfExperience must be non-negative.",
        });
      });

      test("should return 400 for negative yearsOfExperience", async () => {
        const response = await request
          .post("/api/calculateDiscount")
          .send({ age: 30, yearsOfExperience: -2 });
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual({
          error:
            "Invalid input: age and yearsOfExperience must be non-negative.",
        });
      });
    });
  });

  ///////////////////--- BOUNDARY TEST CASES  ---/////////////////////////

  describe("Boundary Test Cases (Edge Conditions)", () => {
    test("should return 10% discount at age 25 and experience 6 (lower boundary of initial filter)", async () => {
      const response = await request
        .post("/api/calculateDiscount")
        .send({ age: 25, yearsOfExperience: 6 });
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ discount: 10 }); 
    });

    test("should return 10% discount at age 26 and experience 5 (lower boundary of initial filter)", async () => {
      const response = await request
        .post("/api/calculateDiscount")
        .send({ age: 26, yearsOfExperience: 5 });
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ discount: 10 }); 
    });

    test("should return 10% discount at age 26 and experience 6 (first non-zero boundary)", async () => {
      const response = await request
        .post("/api/calculateDiscount")
        .send({ age: 26, yearsOfExperience: 6 });
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ discount: 10 }); // 5 (age>=25) + 5 (exp>=5)
    });

    test("should return 10% discount at age 39 and experience 9 (just below age 40 and exp 10)", async () => {
      const response = await request
        .post("/api/calculateDiscount")
        .send({ age: 39, yearsOfExperience: 9 });
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ discount: 10 });
    });

    test("should return 15% discount at age 40 and experience 9 (age 40 boundary met, exp 10 not)", async () => {
      const response = await request
        .post("/api/calculateDiscount")
        .send({ age: 40, yearsOfExperience: 9 });
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ discount: 15 }); // 5 (age>=25) + 5 (exp>=5) + 5 (age>=40)
    });

    test("should return 15% discount at age 39 and experience 10 (exp 10 boundary met, age 40 not)", async () => {
      const response = await request
        .post("/api/calculateDiscount")
        .send({ age: 39, yearsOfExperience: 10 });
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ discount: 15 }); // 5 (age>=25) + 5 (exp>=5) + 5 (exp>=10)
    });

    test("should return 20% discount at age 40 and experience 10 (exact max discount boundary)", async () => {
      const response = await request
        .post("/api/calculateDiscount")
        .send({ age: 40, yearsOfExperience: 10 });
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ discount: 20 });
    });

    test("should handle zero age and zero experience for no discount (as per initial rule)", async () => {
      const response = await request
        .post("/api/calculateDiscount")
        .send({ age: 0, yearsOfExperience: 0 });
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ discount: 0 });
    });
  });
});
