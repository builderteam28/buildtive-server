const request = require("supertest");
const app = require("../app");
const { User, sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const { queryInterface } = sequelize;

describe("POST /users/register", () => {
  afterAll(async () => {
    await sequelize.queryInterface.bulkDelete("Users", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  });

  describe("POST /users/register - Email and Password pass", () => {
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

  describe("POST /users/register - Email key is null or undefined", () => {
    it("should respond with status code 400 and returning email required", async () => {
      const payloadRegisterMissing = {
        fullName: "RegisterTest",
        // email: "RegisterTest2@gmail.com",
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

  describe("POST /users/register - Email must be unique", () => {
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
      await expect(result.body).toHaveProperty(
        "message",
        "Email already registered"
      );
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
  afterAll(async () => {
    await sequelize.queryInterface.bulkDelete("Users", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  });
  describe("POST /users/login - login passed", () => {
    it("it should pass", async () => {
      const payloadLoginPass = {
        email: "RegisterTest@gmail.com",
        password: "testestes",
      };
      const result = await request(app)
        .post("/users/login")
        .send(payloadLoginPass);
      await expect(result.status).toBe(200);
      await expect(result.body).toHaveProperty(
        "access_token",
        expect.any(String)
      );
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
      await expect(result.status).toBe(401);
      await expect(result.body).toHaveProperty(
        "message",
        "Invalid email/password"
      );
    });
  });

  describe("POST /users/login - email miss", () => {
    it("it should miss", async () => {
      const payloadLoginMiss = {
        email: "setset@gmail.com",
        password: "testestes",
      };
      const result = await request(app)
        .post("/users/login")
        .send(payloadLoginMiss);
      expect(result.status).toBe(401);
      expect(result.body).toHaveProperty("message", "Invalid email/password");
    });
  });
  describe("POST /users/login - email empty", () => {
    it("it should miss", async () => {
      const payloadLoginMiss = {
        email: "",
        password: "testestes",
      };
      const result = await request(app)
        .post("/users/login")
        .send(payloadLoginMiss);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message", "Email is required");
    });
  });

  describe("POST /users/login - password empty", () => {
    it("it should miss", async () => {
      const payloadLoginMiss = {
        email: "testestes@mail.com",
        password: "",
      };
      const result = await request(app)
        .post("/users/login")
        .send(payloadLoginMiss);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message", "Password is required");
    });
  });
});

describe("GET users/:id", () => {
  let validToken;
  const inValidToken = `salahhh`;
  beforeAll(async () => {
    const userObject = {
      fullName: `buat testing`,
      email: `buattest@mail.com`,
      password: `asdf1234`,
      phoneNumber: `phone12`,
      address: "bandung",
    };
    await request(app).post("/users/register").send(userObject);
    const login = await request(app).post("/users/login").send({
      email: userObject.email,
      password: userObject.password,
    });

    validToken = login.body.access_token;
  });

  afterAll(async () => {
    await sequelize.queryInterface.bulkDelete("Users", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  });
  describe("GET users/:id success", () => {
    it("should get status 200 and returning user", async () => {
      const headers = {
        access_token: validToken,
      };
      // console.log(headers);
      const id = 1;
      const result = await request(app).get(`/users/${id}`).set(headers);
      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty("id", expect.any(Number));
      expect(result.body).toHaveProperty("fullName", expect.any(String));
      expect(result.body).toHaveProperty("email", expect.any(String));
    });
  });
  describe("GET users/:id fail unauthorized", () => {
    it("should get status 401 and returning Unauthorized", async () => {
      const headers = {
        access_token: inValidToken,
      };
      const id = 1;
      const result = await request(app).get(`/users/${id}`).set(headers);
      expect(result.status).toBe(401);
      expect(result.body).toHaveProperty("message", "Please login first");
    });
  });
});

describe("PUT /users/:id", () => {
  let validToken;
  const inValidToken = `salahhh`;
  beforeAll(async () => {
    const userObject = {
      fullName: `buat testing`,
      email: `buattest@mail.com`,
      password: `asdf1234`,
      phoneNumber: `phone12`,
      address: "bandung",
    };
    await request(app).post("/users/register").send(userObject);
    const login = await request(app).post("/users/login").send({
      email: userObject.email,
      password: userObject.password,
    });

    validToken = login.body.access_token;
  });

  afterAll(async () => {
    await sequelize.queryInterface.bulkDelete("Users", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  });
  describe("PUT /users/:id success", () => {
    it("should get status 200 and returning message success update", async () => {
      const headers = {
        access_token: validToken,
      };
      const bodyUpdate = {
        fullName: "asep",
        phoneNumber: "1232132",
        address: "bandung",
      };
      const result = await request(app)
        .put("/users/:id")
        .set(headers)
        .send(bodyUpdate);
      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty("message", "Profile updated");
    });
  });
  describe("PUT /users/:id fail", () => {
    it("should get status 401 and returning Unauthorized", async () => {
      const headers = {
        access_token: inValidToken,
      };
      const bodyUpdate = {
        fullName: "dadang",
        phoneNumber: "12323125",
        address: "cimahi",
      };
      const result = await request(app)
        .put("/users/:id")
        .set(headers)
        .send(bodyUpdate);
      expect(result.status).toBe(401);
      expect(result.body).toHaveProperty("message", "Please login first");
    });
  });
  describe("PUT /users/:id fail", () => {
    it("should get status 401 and Fullname is required", async () => {
      const headers = {
        access_token: validToken,
      };
      const bodyUpdate = {
        fullName: "",
        phoneNumber: "12323125",
        address: "cimahi",
      };
      const result = await request(app)
        .put("/users/:id")
        .set(headers)
        .send(bodyUpdate);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message", "Fullname is required");
    });
  });
  describe("PUT /users/:id fail", () => {
    it("should get status 400 and returning phoneNumber is required", async () => {
      const headers = {
        access_token: validToken,
      };
      const bodyUpdate = {
        fullName: "asepdadang",
        phoneNumber: "",
        address: "cimahi",
      };
      const result = await request(app)
        .put("/users/:id")
        .set(headers)
        .send(bodyUpdate);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message", "Phonenumber is required");
    });
  });
  describe("PUT /users/:id fail", () => {
    it("should get status 400 and returning Address is required", async () => {
      const headers = {
        access_token: validToken,
      };
      const bodyUpdate = {
        fullName: "hahaydadang",
        phoneNumber: "12323125",
        address: "",
      };
      const result = await request(app)
        .put("/users/:id")
        .set(headers)
        .send(bodyUpdate);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message", "Address is required");
    });
  });
});
