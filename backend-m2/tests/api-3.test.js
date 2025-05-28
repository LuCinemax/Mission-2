const request = require("supertest");
const app = require("../server");

describe("POST /api/quote", () => {
  it("should return correct premiums for valid input", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: 6614, risk_rating: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      monthly_premium: 27.56,
      yearly_premium: 330.7,
    });
  });

  it("should return error for missing fields", async () => {
    const res = await request(app).post("/api/quote").send({ car_value: 5000 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return error for risk out of range", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: 5000, risk_rating: 6 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return error for wrong types", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: "abc", risk_rating: "def" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return correct premiums for low risk", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: 10000, risk_rating: 1 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      monthly_premium: 8.33,
      yearly_premium: 100,
    });
  });

  it("should return correct premiums for mid-range input", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: 8000, risk_rating: 3 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      monthly_premium: 20.0,
      yearly_premium: 240,
    });
  });

  it("should return error for risk rating below range", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: 5000, risk_rating: 0 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return error for string risk_rating", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: 5000, risk_rating: "low" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return error when both fields are missing", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
