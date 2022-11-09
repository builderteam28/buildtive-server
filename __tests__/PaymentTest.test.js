const request = require("supertest");
const app = require("../app");
const { User, Project, sequelize, Category } = require("../models");
const bcrypt = require("bcryptjs");
const { queryInterface } = sequelize;

let validToken;
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
  console.log(categories);
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
      CategoryId: 3,
    })
    .set({ access_token: validToken });
  const projects = await Project.findAll();
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

describe("patch /payments/:ProjectId", () => {
  it("should receive message success edit", async () => {
    const headers = {
      access_token: validToken,
    };
    const ProjectId = 1;
    const result = await request(app)
      .patch(`/payments/${ProjectId}`)
      .set(headers);
    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty("message", "payment paid");
  });
});
