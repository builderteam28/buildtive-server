const request = require("supertest");
const app = require("../app");
const { Worker, sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const { queryInterface } = sequelize;

describe.skip("POST /workers/register", () => {
  afterAll(() => {
    sequelize.queryInterface.bulkDelete("Workers", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  });

  afterEach(() => {
    sequelize.queryInterface.bulkDelete("Workers", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  });

  describe.skip("POST /workers/register - Email and Password Pass", () => {
    it("should respond with status code 201 and returning id and email", async () => {
      const payloadRegisterSuccess = {
        fullName: "workers test",
        email: "workertest@gmail.com",
        password: "12345678",
        phoneNumber: "0812345678",
        address: "Bandung",
      };
      const result = await request(app)
        .post("/workers/register")
        .send(payloadRegisterSuccess);
      await expect(result.status).toBe(201);
      await expect(result.body).toBeInstanceOf(Object);
      await expect(result.body).toHaveProperty("id", expect.any(Number));
      await expect(result.body).toHaveProperty("workers", expect.any(String));
    });
  });

  describe.skip("POST /workers/register - Email key is missing", () => {
    it("should respond with status code 400 and returning error message", async () => {
      const payloadWorkersMiss = {
        username: "workers test",
        // email: "workertest@gmail.com",
        password: "12345678",
        phoneNumber: "0812345678",
        address: "Bandung",
      };
      const result = await request(app)
        .post("/workers/register")
        .send(payloadWorkersMiss);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message", "Email is required");
    });
  });

  describe.skip("POST /workers/register - Email key is null", () => {
    it("should respond with status code 400 and returning error message", async () => {
      const payloadWorkersMiss = {
        username: "workers test",
        email: "",
        password: "12345678",
        phoneNumber: "0812345678",
        address: "Bandung",
      };
      const result = await request(app)
        .post("/workers/register")
        .send(payloadWorkersMiss);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message", "Email is required");
    });
  });
});
