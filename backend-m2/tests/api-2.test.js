const request = require('supertest');
const app = require('../server');

describe('Api 2: Risk Rating Endpoint /api/risk-rating', () => {
  // Positive Test Cases
  test("No keywords should return risk rating of 0", async () => {
    const res = await request(app)
    .post('/api/risk-rating')
    .send({claim_history: "I have had no accidents"})
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({risk_rating: 0})
  })

  test('2 keywords should return risk rating of 2', async () => {
    const res = await request(app)
    .post('/api/risk-rating')
    .send({claim_history: "Crash, Scratch"})
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({risk_rating: 2})
  })

  test('3 keywords should return risk rating of 3', async () => {
    const res = await request(app)
    .post('/api/risk-rating')
    .send({claim_history: "Crash, Bump, Collide"})
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({risk_rating: 3})
  })

  test('4 keywords should return risk rating of 4', async () => {
    const res = await request(app)
    .post('/api/risk-rating')
    .send({claim_history: "Scratch, Bump, Smash, Collide"})
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({risk_rating: 4})
  })

  test('repeated keywords still return risk rating', async () => {
    const res = await request(app)
    .post('/api/risk-rating')
    .send({claim_history: "Scratch, Scratch, Bump, Bump"})
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({risk_rating: 4})
  })

  test('Plural and past tense words still return a risk rating', async () => {
    const res = await request(app)
    .post('/api/risk-rating')
    .send({claim_history: "Scratched, Crashed"})
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({risk_rating: 2})
  })

  test('Make it case insensitive', async () => {
    const res = await request(app)
    .post('/api/risk-rating')
    .send({claim_history: "SCRATCH, CoLliDE"})
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({risk_rating: 2})
  })
  //negative test cases
  test('If input is a empty string returns an error', async () => {
    const res = await request(app)
    .post('/api/risk-rating')
    .send({claim_history: ""})
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({error: "Invalid input entered"})
  })
  
  test('if input is an array it returns an error', async () => {
    const res = await request(app)
    .post('/api/risk-rating')
    .send({claim_history: ["crash"]})
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({error: "Invalid input entered"})
  })

  test('If input is numbers returns an error', async () => {
    const res = await request(app)
    .post('/api/risk-rating')
    .send({claim_history: 12345})
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({error: "Invalid input entered"})
  })

  test('If input is null returns an error', async () => {
    const res = await request(app)
    .post('/api/risk-rating')
    .send({claim_history: null})
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({error: "Invalid input entered"})
  })
});