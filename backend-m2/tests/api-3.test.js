const request = require("supertest");
const app = require("../server");

// ========VALID TEST CASES======== //
describe("POST /api/quote", () => {
  // Mid Range
  it("returns 200 and correct premiums for standard valid input values", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: 8000, risk_rating: 3 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      monthly_premium: "$20",
      yearly_premium: "$240",
    });
  });

  // ========BOUNDARY CASES======== //

  // Low Range
  it("returns 200 and correct premiums for minimum valid input values", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: 1, risk_rating: 1 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
  monthly_premium: "$0",
  yearly_premium: "$0.01",
});
  });

  // High Range
  it("returns 200 and correct premiums for maximum valid input values", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: 1000000, risk_rating: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      monthly_premium: "$4166.67",
      yearly_premium: "$50000",
    });
  });

  // ========EDGE CASES======== //

  // Minimum Price Valuation For Car
  it("returns 200 and correct premiums when car_value is just above 0", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: 0.01, risk_rating: 1 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      monthly_premium: "$0",
      yearly_premium: "$0.0001",
    });
  });

  // ========INVALID INPUT CASES======== //

  // Fail on non integer ratings
  it("returns 400 when risk_rating is a decimal", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: 5000, risk_rating: 2.5 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  // Fail on rating if reads as string
  it("returns 400 when risk_rating is a string at upper bound", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: 10000, risk_rating: "5" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  // ========NULL CASES======== //

  // Null Car Value
  it("returns 400 when car_value is null", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: null, risk_rating: 3 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  // Null risk rating
  it("returns 400 when risk_rating is null", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: 5000, risk_rating: null });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
