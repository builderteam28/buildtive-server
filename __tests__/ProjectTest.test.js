const request = require("supertest");
const app = require("../app");
const { Project, sequelize, User } = require("../models");
const bcrypt = require("bcryptjs");
const { head } = require("../router");
const { queryInterface } = sequelize;

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
  console.log(validToken);

  const projects = require("../data/db.json").projects.map((el) => {
    return {
      ...el,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
  await Project.bulkCreate(projects);
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Projects", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await sequelize.queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});
describe("GET /users/projects", () => {
  describe("get all projects", () => {
    it("Should get all projects", async () => {
      const headers = {
        access_token: validToken,
      };

      const result = await request(app).get("/users/projects").set(headers);
      await expect(result.status).toBe(200);
      await expect(result.body).toBeInstanceOf(Object);
    });
  });
  describe("Should get error when there is no access_token sent", () => {
    it("should get error 401 and message login first", async () => {
      const result = await request(app).get("/users/projects");
      await expect(result.status).toBe(401);
      await expect(result.body).toHaveProperty("message", "Please login first");
    });
  });
  describe("Should get error when access_token false", () => {
    it("should get error 401 and message login first", async () => {
      const headers = {
        access_token: inValidToken,
      };
      const result = await request(app).get("/users/projects").set(headers);
      await expect(result.status).toBe(401);
      await expect(result.body).toHaveProperty("message", "Please login first");
    });
  });
});

describe("Get /users/projects/:id", () => {
  describe("get project with id in params", () => {
    it("should get project with id in params", async () => {
      const headers = {
        access_token: validToken,
      };
      const id = 1;
      const result = await request(app)
        .get(`/users/projects/${id}`)
        .set(headers);
      await expect(result.status).toBe(200);
      await expect(result.body).toBeInstanceOf(Object);
      await expect(result.body).toHaveProperty("id", id);
      await expect(result.body).toHaveProperty("Workers", expect.any(Object));
      await expect(result.body).toHaveProperty("Category", expect.any(Object));
    });
  });
  describe("get project with wrong id in params", () => {
    it("should get error 404", async () => {
      const headers = {
        access_token: validToken,
      };
      const id = 3;
      const result = await request(app)
        .get(`/users/projects/${id}`)
        .set(headers);
      await expect(result.status).toBe(404);
      await expect(result.body).toBeInstanceOf(Object);
      await expect(result.body).toHaveProperty("message", "Project not found");
    });
  });
  describe("Should get error when there is no access_token sent", () => {
    it("should get error 401 and message login first", async () => {
      const result = await request(app).get("/users/projects/1");
      await expect(result.status).toBe(401);
      await expect(result.body).toHaveProperty("message", "Please login first");
    });
  });
  describe("Should get error when access_token false", () => {
    it("should get error 401 and message login first", async () => {
      const headers = {
        access_token: inValidToken,
      };
      const result = await request(app).get("/users/projects/1").set(headers);
      await expect(result.status).toBe(401);
      await expect(result.body).toHaveProperty("message", "Please login first");
    });
  });
});
