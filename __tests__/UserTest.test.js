const request = require("supertest");
const app = require("../app");
const { User, sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const { queryInterface } = sequelize;

describe.skip("POST /users/register", () => {
  afterAll(() => {
    sequelize.queryInterface.bulkDelete("Users", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  });
  afterEach(() => {
    sequelize.queryInterface.bulkDelete("Users", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  });

  describe("POST /users/register - Email and Password pass", () => {
    it("should respond with status code 201 and returning id and email", async () => {
      const payloadRegisterSuccess = {
        username: "RegisterTest",
        email: "RegisterTest@gmail.com",
        password: "testestes",
        phoneNumber: "0812345678910",
        address: "Bandung",
      };
      const result = await request(app)
        .post("/users/register")
        .send(payloadRegisterSuccess);
      expect(result.status).toBe(201);
      expect(result.body).toBeInstanceOf(Object);
      expect(result.body).toHaveProperty("id", expect.any(Number));
      expect(result.body).toHaveProperty("user", expect.any(String));
    });
  });

  describe("POST /users/register - Email key is null or undefined", () => {
    it("should respond with status code 400 and returning email required", async () => {
      const payloadRegisterMissing = {
        username: "RegisterTest",
        // email: "RegisterTest@gmail.com",
        password: "012345678910",
        phoneNumber: "0812345678910",
        address: "Bandung",
      };
      const result = await request(app)
        .post("/users/register")
        .send(payloadRegisterMissing);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message", "Email is required");
    });
  });
});

describe.skip("POST /users/login", () => {
  beforeAll(async () => {
    await User.create({
      username: "RegisterTest",
      email: "RegisterTest@gmail.com",
      password: "testestes",
      phoneNumber: "0812345678910",
      address: "Bandung",
    });
  });
  afterAll(() => {
    sequelize.queryInterface.bulkDelete("Users", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  });
  describe("POST /users/login - login passed", () => {
    it("it should pass", async () => {
      const payloadLoginPass = {
        email: "testest@gmail.com",
        password: "12345678",
      };
      const result = await request(app)
        .post("/users/login")
        .send(payloadLoginPass);
      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty("access_token", expect.any(String));
    });
  });

  describe("POST /users/login - login miss", () => {
    it("it should miss", async () => {
      const payloadLoginMiss = {
        email: "testest@gmail.com",
        password: "87654321",
      };
      const result = await request(app)
        .post("/users/login")
        .send(payloadLoginMiss);
      expect(result.status).toBe(401);
      expect(result.body).toHaveProperty("message", "Invalid Email/Password");
    });
  });

  describe("POST /users/login - email miss", () => {
    it("it should miss", async () => {
      const payloadLoginMiss = {
        email: "setset@gmail.com",
        password: "12345678",
      };
      const result = await request(app)
        .post("/users/login")
        .send(payloadLoginMiss);
      expect(result.status).toBe(401);
      expect(result.body).toHaveProperty("message", "Invalid Email/Password");
    });
  });
});