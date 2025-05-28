const request = require("supertest");
const app = require("../server");

describe("Api 2: Risk Rating Endpoint /api/risk-rating", () => {
  // Positive Test Cases
  test("3 keywords should return risk rating of 3", async () => {
    // Sends a post request with a claim_history
    const res = await request(app)
      .post("/api/risk-rating")
      .send({ claim_history: "Crash, Bump, Collide" });
      // Expect a 200 OK response, since input is valid and has keywords
    expect(res.statusCode).toBe(200);
    // Expect the risk_rating to equal 3 (1 for crash, 1 for bump and 1 for collide)
    expect(res.body).toEqual({ risk_rating: 3 });
  });

  test("repeated keywords still return risk rating", async () => {
    const res = await request(app)
      .post("/api/risk-rating")
      .send({ claim_history: "Scratch, Scratch, Bump, Bump" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ risk_rating: 4 });
  });

  test("Plural and past tense words still return a risk rating", async () => {
    const res = await request(app)
      .post("/api/risk-rating")
      .send({ claim_history: "Scratched, Crashed" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ risk_rating: 2 });
  });

  test("Make it case insensitive", async () => {
    const res = await request(app)
      .post("/api/risk-rating")
      .send({ claim_history: "SCRATCH, CoLliDE" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ risk_rating: 2 });
  });
  //negative test cases
  test("If input is a empty string returns an error", async () => {
    // Sends a post request with a claim_history
    const res = await request(app)
      .post("/api/risk-rating")
      .send({ claim_history: "" });
    // Expect a 400 bad request response since input is invalid
    expect(res.statusCode).toBe(400);
    // Expects an error since the claim_history is an invalid input
    expect(res.body).toEqual({ error: "Invalid input entered" });
  });

  test("if input is an array it returns an error", async () => {
    const res = await request(app)
      .post("/api/risk-rating")
      .send({ claim_history: ["crash"] });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Invalid input entered" });
  });

  test("If input is numbers returns an error", async () => {
    const res = await request(app)
      .post("/api/risk-rating")
      .send({ claim_history: 12345 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Invalid input entered" });
  });

  test("If input is null returns an error", async () => {
    const res = await request(app)
      .post("/api/risk-rating")
      .send({ claim_history: null });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Invalid input entered" });
  });
  //Edge/Boundary cases
  test("5 keywords will return a risk rating of 5", async () => {
    const res = await request(app)
      .post("/api/risk-rating")
      .send({ claim_history: "crash, collide, bump, scratch, smash" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ risk_rating: 5 });
  });

  test("1 keywords will return a risk rating of 1", async () => {
    const res = await request(app)
      .post("/api/risk-rating")
      .send({ claim_history: "crash" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ risk_rating: 1 });
  });

  test("More then 5 keywords will return an error", async () => {
    const res = await request(app)
      .post("/api/risk-rating")
      .send({ claim_history: "crash, collide, bump, scratch, smash, crashed" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "To many risky events" });
  });

  test("No keywords should return an error", async () => {
    const res = await request(app)
      .post("/api/risk-rating")
      .send({ claim_history: "I have had no accidents" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "No risky events" });
  });
});
