const request = require("supertest");
const app = require("../server");

describe("POST /api/quote", () => {
  // === Valid Cases ===
  it("returns 200 and correct premium for valid car_value and risk_rating (middle range)", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: 8000, risk_rating: 3 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      monthly_premium: 20.0,
      yearly_premium: 240,
    });
  });

  it("returns 200 and correct premium for low risk rating", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: 10000, risk_rating: 1 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      monthly_premium: 8.33,
      yearly_premium: 100,
    });
  });

  it("returns 200 and correct premium for high risk rating", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: 6614, risk_rating: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      monthly_premium: 27.56,
      yearly_premium: 330.7,
    });
  });

  // === Invalid Input: Type Issues ===
  it("returns 400 if car_value and risk_rating are strings", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: "abc", risk_rating: "def" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 400 if risk_rating is a string", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: 7000, risk_rating: "low" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  // === Invalid Input: Missing Fields ===
  it("returns 400 if car_value is provided but risk_rating is missing", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: 7000 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 400 if risk_rating is provided but car_value is missing", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ risk_rating: 3 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 400 if both fields are missing", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  // === Invalid Input: Range Issues ===
  it("returns 400 if risk_rating is below range", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: 6000, risk_rating: 0 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 400 if risk_rating is above range", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: 6000, risk_rating: 6 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  // === Edge Cases ===
  it("returns 400 if car_value is 0", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: 0, risk_rating: 3 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 400 if car_value is negative", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ car_value: -1000, risk_rating: 2 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
