const supertest = require("supertest");

const server = require("./server.js");

describe("server.js", function() {
  describe("environment", function() {
    it("should set environment to testing", function() {
      expect(process.env.DB_ENV).toBe("testing");
    });
  });

  describe("GET /", function() {
    it("should return a 200 OK", function() {
      // spin up the server
      return supertest(server)
        .get("/")
        .then(res => {
          expect(res.status).toBe(200);
        });
      // make GET supertest to /
      // look at the http status code for the response
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

    it("auth example", function() {
      return supertest(server)
        .post("/api/auth/login")
        .send({ username: "ignaciosm", password: "test1234" })
        .then(res => {
          const token = res.body.token;

          return supertest(server)
            .get("/")
            .set("Authorization", token)
            .then(res => {
              expect(res.status).toBe(200);
              expect.objectContaining({
                id: expect.any(Number),
                token: expect.anything(),
              })
            });
        });
    });
  });
});
