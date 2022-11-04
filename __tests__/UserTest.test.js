const request = require("supertest");
const app = require("../app");
const { User, sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const { queryInterface } = sequelize;

describe.skip("POST /users/register", () => {
  afterAll(async() => {
    await sequelize.queryInterface.bulkDelete("Users", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  });

  describe.skip("POST /users/register - Email and Password pass", () => {
    it("should respond with status code 201 and returning id and email", async () => {
      const payloadRegisterSuccess = {
        fullName: "RegisterTest",
        email: "RegisterTest@gmail.com",
        password: "testestes",
        phoneNumber: "0812345678910",
        address: "Bandung",
      };
      const result = await request(app)
        .post("/users/register")
        .send(payloadRegisterSuccess);
      await expect(result.status).toBe(201);
      await expect(result.body).toBeInstanceOf(Object);
      // expect(result.body).toHaveProperty("id", expect.any(Number));
      await expect(result.body).toHaveProperty("message", "Created new User");
    });
  });

  describe.skip("POST /users/register - Email key is null or undefined", () => {
    it("should respond with status code 400 and returning email required", async () => {
      const payloadRegisterMissing = {
        fullName: "RegisterTest",
        // email: "RegisterTest@gmail.com",
        password: "012345678910",
        phoneNumber: "0812345678910",
        address: "Bandung",
      };
      const result = await request(app)
        .post("/users/register")
        .send(payloadRegisterMissing);
      await expect(result.status).toBe(400);
      await expect(result.body).toHaveProperty("message", "Email Required");
    });
  });
  
  describe.skip("POST /users/register - Email must be unique", () => {
    it("should respond with status code 400 and returning message Email is already registered", async () => {
      const payloadRegisterSuccess = {
        fullName: "RegisterTest",
        email: "RegisterTest@gmail.com",
        password: "testestes",
        phoneNumber: "0812345678910",
        address: "Bandung",
      };
      const result = await request(app)
        .post("/users/register")
        .send(payloadRegisterSuccess);
      await expect(result.status).toBe(400);
      // expect(result.body).toHaveProperty("id", expect.any(Number));
      await expect(result.body).toHaveProperty("message", "Email already registered");
    });
  });

});

describe("POST /users/login", () => {
  beforeAll(async () => {
    await User.create({
      fullName: "RegisterTest",
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
  describe.skip("POST /users/login - login passed", () => {
    it("it should pass", async () => {
      const payloadLoginPass = {
        email: "RegisterTest@gmail.com",
        password: "testestes",
      };
      const result = await request(app)
        .post("/users/login")
        .send(payloadLoginPass);
      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty("access_token", expect.any(String));
    });
  });

  describe.skip("POST /users/login - login miss", () => {
    it("it should miss", async () => {
      const payloadLoginMiss = {
        email: "testest@gmail.com",
        password: "87654321",
      };
      const result = await request(app)
        .post("/users/login")
        .send(payloadLoginMiss);
      expect(result.status).toBe(401);
      expect(result.body).toHaveProperty("message", "Invalid email/password");
    });
  });

  describe.skip("POST /users/login - email miss", () => {
    it("it should miss", async () => {
      const payloadLoginMiss = {
        email: "setset@gmail.com",
        password: "12345678",
      };
      const result = await request(app)
        .post("/users/login")
        .send(payloadLoginMiss);
      expect(result.status).toBe(401);
      expect(result.body).toHaveProperty("message", "Invalid email/password");
    });
  });
});