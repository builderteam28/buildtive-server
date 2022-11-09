const request = require("supertest");
const app = require("../app");
const { User, Project, sequelize, Category } = require("../models");
const bcrypt = require("bcryptjs");
const { queryInterface } = sequelize;

let validToken, validTokenWorker;
beforeAll(async () => {
  const input = {
    fullName: "asep asd",
    email: "asep@gmail.com",
    password: "password",
    phoneNumber: "98021902",
    address: "jauh banget",
  };
  const user = await request(app).post(`/users/register`).send(input);
  const category = await Category.create({ name: "tes" });
  const categories = await Category.findAll();
  const login = await request(app).post("/users/login").send({
    email: input.email,
    password: input.password,
  });
  validToken = login.body.access_token;
  const project = await request(app)
    .post("/users/projects")
    .send({
      name: "testing",
      description: "testing",
      address: "testing",
      tenor: 3,
      totalWorker: 3,
      cost: 1672902,
      UserId: 1,
      long: 1092,
      lat: 29010,
      CategoryId: 1,
    })
    .set({ access_token: validToken });
  const projects = await Project.findAll();

  const workers = [
    {
      email: "workertest1@gmail.com",
      password: "12345678",
      fullName: "workers test",
      phoneNumber: "0812345678",
      address: "Bandung",
      birthDate: new Date(),
      idNumber: "123213212",
      CategoryId: 1,
    },
    {
      email: "workertest2@gmail.com",
      password: "12345678",
      fullName: "workers test2",
      phoneNumber: "0812345672",
      address: "Bandung",
      birthDate: new Date(),
      idNumber: "123213212",
      CategoryId: 1,
    },
  ];
  await request(app).post("/workers/register").send(workers[0]);
  await request(app).post("/workers/register").send(workers[1]);
  const loginWorker = await request(app).post("/workers/login").send({
    email: workers[0].email,
    password: workers[0].password,
  });

  validTokenWorker = loginWorker.body.access_token;
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await sequelize.queryInterface.bulkDelete("Categories", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await sequelize.queryInterface.bulkDelete("Projects", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

describe("POST /payments", () => {
  it("should receive transaction token", async () => {
    const headers = {
      access_token: validToken,
    };

    const result = await request(app)
      .post("/payments")
      .set(headers)
      .send({ ProjectId: 1, cost: 100000 });
    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty("redirect_url", expect.any(String));
    expect(result.body).toHaveProperty("token", expect.any(String));
  });

  it("should fail because no ProjectId sent on req.body", async () => {
    const headers = {
      access_token: validToken,
    };

    const result = await request(app)
      .post("/payments")
      .set(headers)
      .send({ cost: 100000 });
    expect(result.status).toBe(500);
  });
});

describe("POST /payments/:ProjectId", () => {
  it("bulks create payment", async () => {
    const headers = {
      access_token: validToken,
    };

    const result = await request(app)
      .post("/payments/1")
      .set(headers)
      .send({ cost: 40000 });
    expect(result.status).toBe(200);
  });

  it("fail because no cost on req body", async () => {
    const headers = {
      access_token: validToken,
    };

    const result = await request(app).post("/payments/2").set(headers);

    expect(result.status).toBe(500);
  });
});

describe("get /payment/transaction", () => {
  it("get all transaction history worker", async () => {
    const headers = {
      access_token: validTokenWorker,
    };

    const result = await request(app).get("/workers/transaction").set(headers);
    expect(result.status).toBe(200);
  });
});

describe("patch /payments/:ProjectId", () => {
  it("should receive message success edit", async () => {
    const headers = {
      access_token: validToken,
    };
    const ProjectId = 1;
    const result = await request(app)
      .put(`/payments/${ProjectId}`)
      .set(headers)
      .send({ cost: 100000 });
    expect(result.status).toBe(200);
  });
});
