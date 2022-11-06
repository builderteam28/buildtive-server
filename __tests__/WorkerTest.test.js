const request = require("supertest");
const app = require("../app");
const { Worker, sequelize } = require("../models");
const { queryInterface } = sequelize;
const { sign } = require("../helpers/jwt");
const { hash } = require("../helpers/bcrypt");

describe("POST /workers/register", () => {
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

  describe("POST /workers/register - Email and Password Pass", () => {
    it("should respond with status code 201 and returning string message", async () => {
      const payloadRegisterSuccess = {
        fullName: "workers test",
        email: "workertest@gmail.com",
        password: "12345678",
        phoneNumber: "0812345678",
        birthDate: "1996-10-28 09:09:39.749 +00:00",
        address: "Bandung",
        idNumber: "1421188123123",
      };
      const result = await request(app)
        .post("/workers/register")
        .send(payloadRegisterSuccess);
      expect(result.status).toBe(201);
      expect(result.body).toBeInstanceOf(Object);
      expect(result.body).toHaveProperty("message", expect.any(String));
    });
  });

  describe("POST /workers/register - Email key is missing", () => {
    it("should respond with status code 400 and returning error message", async () => {
      const payloadWorkersMiss = {
        fullName: "workers test",
        email: undefined,
        password: "12345678",
        phoneNumber: "0812345678",
        birthDate: "1996-10-28 09:09:39.749 +00:00",
        address: "Bandung",
        idNumber: "1421188123123",
      };
      const result = await request(app)
        .post("/workers/register")
        .send(payloadWorkersMiss);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message", "Email is required");
    });
  });

  describe("POST /workers/register - Email key is null", () => {
    it("should respond with status code 400 and returning error message", async () => {
      const payloadWorkersMiss = {
        fullName: "workers test",
        email: "",
        password: "12345678",
        phoneNumber: "0812345678",
        birthDate: "1996-10-28 09:09:39.749 +00:00",
        address: "Bandung",
        idNumber: "1421188123123",
      };
      const result = await request(app)
        .post("/workers/register")
        .send(payloadWorkersMiss);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message", "Email is required");
    });
  });

  describe("POST /workers/register - Password key is missing", () => {
    it("should respond with status code 400 and returning error message", async () => {
      const payloadWorkersMiss = {
        fullName: "workers test",
        email: "workertest@gmail.com",
        password: undefined,
        phoneNumber: "0812345678",
        birthDate: "1996-10-28 09:09:39.749 +00:00",
        address: "Bandung",
        idNumber: "1421188123123",
      };
      const result = await request(app)
        .post("/workers/register")
        .send(payloadWorkersMiss);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message", "Password is required");
    });
  });

  describe("POST /workers/register - Password key is null", () => {
    it("should respond with status code 400 and returning error message", async () => {
      const payloadWorkersMiss = {
        fullName: "workers test",
        email: "workertest@gmail.com",
        password: "",
        phoneNumber: "0812345678",
        birthDate: "1996-10-28 09:09:39.749 +00:00",
        address: "Bandung",
        idNumber: "1421188123123",
      };
      const result = await request(app)
        .post("/workers/register")
        .send(payloadWorkersMiss);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message", "Password is required");
    });
  });

  describe("POST /workers/register - fail test", () => {
    it("should respond with status code 400 and returning error message", async () => {
      const payloadWorkersMiss = {
        fullName: "workers test",
        email: "workertest",
        password: "12345678",
        phoneNumber: "0812345678",
        birthDate: "1996-10-28 09:09:39.749 +00:00",
        address: "Bandung",
        idNumber: "1421188123123",
      };
      const result = await request(app)
        .post("/workers/register")
        .send(payloadWorkersMiss);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message", "Wrong email format");
    });
  });
});

describe("POST /workers/login", () => {
  beforeAll(async () => {
    await Worker.create({
      fullName: "workers test",
      email: "workertest@gmail.com",
      password: "12345678",
      phoneNumber: "0812345678",
      birthDate: "1996-10-28 09:09:39.749 +00:00",
      address: "Bandung",
      idNumber: "1421188123123",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  afterAll(() => {
    return sequelize.queryInterface
      .bulkDelete("Workers", null, {
        truncate: true,
        cascade: true,
        restartIdentity: true,
      })
      .catch((err) => {
        console.log(err);
      });
  });

  describe("POST /workers/login success test", () => {
    it("Should be return an object with string access_token, id, and email", async () => {
      const payload = { email: "workertest@gmail.com", password: "12345678" };
      const res = await request(app).post("/workers/login").send(payload);
      valid_token = res.body.access_token;
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("access_token", expect.any(String));
      expect(res.body).toHaveProperty("id", expect.any(Number));
      expect(res.body).toHaveProperty("email", expect.any(String));
    });
  });

  describe("POST /workers/login fail test", () => {
    it("Should be return an object with message Email is required", async () => {
      const payload = { email: "", password: "12345678" };
      const res = await request(app).post("/workers/login").send(payload);
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message", expect.any(String));
      expect(res.body).toHaveProperty("message", "Email is required");
    });
  });

  describe("POST /workers/login fail test", () => {
    it("Should be return an object with message Password is required", async () => {
      const payload = { email: "workertest@gmail.com", password: "" };
      const res = await request(app).post("/workers/login").send(payload);
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message", expect.any(String));
      expect(res.body).toHaveProperty("message", "Password is required");
    });
  });

  describe("POST /workers/login fail test", () => {
    it("Should be return an object with message Invalid email/password", async () => {
      const payload = { email: "workertest1@gmail.com", password: "12345678" };
      const res = await request(app).post("/workers/login").send(payload);
      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message", expect.any(String));
      expect(res.body).toHaveProperty("message", "Invalid email/password");
    });
  });

  describe("POST /workers/login fail test", () => {
    it("Should be return an object with message Invalid email/password", async () => {
      const payload = { email: "workertest@gmail.com", password: "12345" };
      const res = await request(app).post("/workers/login").send(payload);
      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message", expect.any(String));
      expect(res.body).toHaveProperty("message", "Invalid email/password");
    });
  });
});

// describe("GET /workers/", () => {
//   let valid_token;
//   beforeAll(async () => {
//     await Worker.create({
//       fullName: "workers test",
//       email: "workertest@gmail.com",
//       password: "12345678",
//       phoneNumber: "0812345678",
//       birthDate: "1996-10-28 09:09:39.749 +00:00",
//       address: "Bandung",
//       idNumber: "1421188123123",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });
//     const payload = {
//       id: worker.id,
//       email: worker.email,
//     };
//     valid_token = sign(payload);
//     console.log(payload);
//   });

//   afterAll(() => {
//     return Worker.destroy({
//       truncate: true,
//       cascade: true,
//       restartIdentity: true,
//     }).catch((err) => {
//       console.log(err);
//     });
//   });

//   describe("GET /workers/:id success test", () => {
//     it("Should be return an object with detail profile of worker with any id", async () => {
//       const res = await request(app)
//         .get("/workers/1")
//         .set("access_token", valid_token);
//       expect(res.status).toBe(200);
//       expect(res.body).toBeInstanceOf(Object);
//       expect(res.body).toHaveProperty("id", expect.any(Number));
//       expect(res.body).toHaveProperty("id", 1);
//       expect(res.body).toHaveProperty("fullname", expect.any(String));
//       expect(res.body).toHaveProperty("fullName", "workers test");
//       expect(res.body).toHaveProperty("phoneNumber", expect.any(String));
//       expect(res.body).toHaveProperty("phoneNumber", "0812345678");
//       expect(res.body).toHaveProperty("birthDate", expect.any(Date));
//       expect(res.body).toHaveProperty(
//         "birthDate",
//         "1996-10-28 09:09:39.749 +00:00"
//       );
//       expect(res.body).toHaveProperty("address", expect.any(String));
//       expect(res.body).toHaveProperty("adress", "Bandung");
//       expect(res.body).toHaveProperty("idNumber", expect.any(String));
//       expect(res.body).toHaveProperty("idNumber", "1421188123123");
//     });
//   });
// });
