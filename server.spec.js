const supertest = require("supertest");

const server = require("./server.js");

describe("environment", function() {
  it("should set environment to testing", function() {
    expect(process.env.DB_ENV).toBe("testing");
  });
});

describe("GET /", function() {
  it("should return a 200 OK", function() {
    return supertest(server)
      .get("/")
      .then(res => {
        expect(res.status).toBe(200);
      });
  });
  it("should return a JSON", function() {
    return supertest(server)
      .get("/")
      .then(res => {
        expect(res.type).toMatch(/json/i);
      });
  });
  it("should return {api: 'up'}", function() {
    return supertest(server)
      .get("/")
      .then(res => {
        expect(res.body.api).toBe("up");
      });
  });
});

describe("GET /recipes", function() {
  it("should return a 200 OK", function() {
    return supertest(server)
      .get("/api/recipes")
      .then(res => {
        expect(res.status).toBe(200);
      });
  });
  it("should return an array of recipes", function() {
    return supertest(server)
      .get("/api/recipes")
      .then(res => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
});

describe("GET /chefs", function() {
  it("should return a 200 OK", function() {
    return supertest(server)
      .get("/api/chefs")
      .then(res => {
        expect(res.status).toBe(200);
      });
  });
  it("should return an array of chefs", function() {
    return supertest(server)
      .get("/api/chefs")
      .then(res => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
});

describe('GET /api/auth/login', function() {
  it("should be able to log in", function() {
    return supertest(server)
      .post("/api/auth/login")
      .send({ username: "ignaciosm", password: "test1234" })
      .then(res => {
        expect(res.status).toBe(200);
        expect.objectContaining({
          id: expect.any(Number),
          token: expect.anything(),
        });
        const token = res.body.token;
        // return supertest(server)
        //   .get("/api/recipes")
        //   .set("token", token)
        //   .then(res => {
        //     expect(res.status).toBe(200);
        //     expect.objectContaining({
        //       id: expect.any(Number),
        //       token: expect.anything(),
        //     })
        //   });
      });
  });  
});

describe('GET /api/auth/register', function() {
  it("should be able to register new chef", function() {
    return supertest(server)
      .post("/api/auth/register")
      .send(
        {
          username: "ignaciosm1",
          password: "test1234",
          email: "ignaciosm1@gmail.com",
          name: "Ignacio San Martin",
          location: "Lima, Peru",
          website: "www.ignaciosm.com",
          phone: "(51)993575330"
        })
      .then(res => {
        expect(res.status).toBe(201);
      });
  });
});

