const request = require("supertest");
const app = require("../app");
const { Worker, sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const { queryInterface } = sequelize;

let validToken;
const inValidToken = `salahhh`;
beforeAll(async () => {
  const userObject = {
    email: "workertest1@gmail.com",
    password: "12345678",
    fullName: "workers test",
    phoneNumber: "0812345678",
    address: "Bandung",
    birthDate: new Date(),
    idNumber: "123213212",
  };
  await request(app).post("/workers/register").send(userObject);
  const login = await request(app).post("/workers/login").send({
    email: userObject.email,
    password: userObject.password,
  });
  validToken = login.body.access_token;
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Workers", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});
describe("POST /workers/register", () => {
  describe("POST /workers/register - Email and Password Pass", () => {
    it("should respond with status code 201 and returning id and email", async () => {
      const payloadRegisterSuccess = {
        email: "workertest2@gmail.com",
        password: "12345678",
        fullName: "workers test",
        phoneNumber: "0812345678",
        address: "Bandung",
        birthDate: new Date(),
        idNumber: "123213212",
      };
      const result = await request(app)
        .post("/workers/register")
        .send(payloadRegisterSuccess);
      await expect(result.status).toBe(201);
      await expect(result.body).toHaveProperty("message", expect.any(String));
    });
  });
  describe("POST /workers/register - Email key is missing", () => {
    it("should respond with status code 400 and returning error message", async () => {
      const payloadWorkersMiss = {
        username: "workers test",
        // email: "workertest@gmail.com",
        fullName: "workers test",
        password: "12345678",
        phoneNumber: "0812345678",
        address: "Bandung",
        birthDate: new Date(),
        idNumber: "123213212",
      };
      const result = await request(app)
        .post("/workers/register")
        .send(payloadWorkersMiss);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message", "Email Required");
    });
  });

  describe("POST /workers/register - Email key is null", () => {
    it("should respond with status code 400 and returning error message", async () => {
      const payloadWorkersMiss = {
        username: "workers test",
        email: "",
        fullName: "workers test",
        password: "12345678",
        phoneNumber: "0812345678",
        address: "Bandung",
        birthDate: new Date(),
        idNumber: "123213212",
      };
      const result = await request(app)
        .post("/workers/register")
        .send(payloadWorkersMiss);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message", "Invalid Email Format");
    });
  });
});

describe("POST /workers/login", () => {
  beforeAll(async () => {
    await Worker.create({
      email: "workertest@gmail.com",
      password: "12345678",
      fullName: "workers test",
      phoneNumber: "0812345678",
      address: "Bandung",
      birthDate: new Date(),
      idNumber: "123213212",
    });
  });
  describe("POST Login SUCCESS", () => {
    it("should get status 200 and returning Access_token", async () => {
      const loginPayloadSuccess = {
        email: "workertest@gmail.com",
        password: "12345678",
      };
      const result = await request(app)
        .post("/workers/login")
        .send(loginPayloadSuccess);
      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty("access_token", expect.any(String));
      expect(result.body).toHaveProperty("id", expect.any(Number));
      expect(result.body).toHaveProperty("fullName", expect.any(String));
    });
  });
  describe("POST Login Failed wrong Password", () => {
    it("should get status 401 and Unauthorized", async () => {
      const loginPayloadSuccess = {
        email: "workertest@gmail.com",
        password: "wrongpassword",
      };
      const result = await request(app)
        .post("/workers/login")
        .send(loginPayloadSuccess);
      expect(result.status).toBe(401);
      expect(result.body).toHaveProperty("message", expect.any(String));
    });
  });
  describe("POST Login Failed wrong Email", () => {
    it("should get status 401 and Unauthorized", async () => {
      const loginPayloadSuccess = {
        email: "wrongEmail@gmail.com",
        password: "wrongpassword",
      };
      const result = await request(app)
        .post("/workers/login")
        .send(loginPayloadSuccess);
      expect(result.status).toBe(401);
      expect(result.body).toHaveProperty("message", expect.any(String));
    });
  });
});

describe("GET /workers/:id By Profile Id", () => {
  describe("success get by id", () => {
    it("should returning status 200, and User Object for Profile", async () => {
      const headers = {
        access_token: validToken,
      };
      const id = 1;
      const result = await request(app).get(`/workers/${id}`).set(headers);
      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty("id", expect.any(Number));
      expect(result.body).toHaveProperty("fullName", expect.any(String));
      expect(result.body).toHaveProperty("email", expect.any(String));
    });
  });

  describe("fail get by id", () => {
    it("should returning status 401 with message Worker Not Found", async () => {
      const headers = {
        access_token: inValidToken,
      };
      const id = 177;
      const result = await request(app).get(`/workers/${id}`).set(headers);
      expect(result.status).toBe(401);
      expect(result.body).toHaveProperty("message", expect.any(String));
    });
  });
});

describe("PUT /workers/:id Edit Profile", () => {
  describe("Edit profile success", () => {
    it("should get 200, and update worker profile", async () => {
      const bodyEdit = {
        fullName: "asep",
        address: "bandung",
        phoneNumber: "197238971",
      };
      const headers = {
        access_token: validToken,
      };
      const id = 1;
      const result = await request(app)
        .put(`/workers/${id}`)
        .set(headers)
        .send(bodyEdit);
      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty("message", expect.any(String));
    });
  });

  describe("Edit profile success", () => {
    it("should get 404 with message Worker Not Found", async () => {
      const bodyEdit = {
        fullName: "asep",
        address: "bandung",
        phoneNumber: "197238971",
      };
      const headers = {
        access_token: inValidToken,
      };
      const id = 177;
      const result = await request(app)
        .put(`/workers/${id}`)
        .set(headers)
        .send(bodyEdit);
      expect(result.status).toBe(401);
      expect(result.body).toHaveProperty("message", expect.any(String));
    });
  });
});
