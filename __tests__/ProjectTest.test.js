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

describe("POST /users/projects", () => {
  describe("User add a new project", () => {
    it("should success add new project", async () => {
      const headers = {
        access_token: validToken,
      };
      const payload = {
        name: "tes",
        workHours: 9,
        totalWorker: 10,
        cost: 2000000,
        UserId: 1,
        CategoryId: 1,
        long: 2901,
        lat: 9303,
      };

      const result = await request(app)
        .post("/users/projects")
        .set(headers)
        .send(payload);

      expect(result.status).toBe(201);
      expect(result.body).toHaveProperty(
        "message",
        `success add project ${payload.name}`
      );
    });
  });

  describe("User fail to add project because name is empty", () => {
    it("should receive status 400 because project name is empty", async () => {
      const headers = {
        access_token: validToken,
      };
      const payload = {
        workHours: 9,
        totalWorker: 10,
        cost: 2000000,
        UserId: 1,
        CategoryId: 1,
        long: 2901,
        lat: 9303,
      };

      const result = await request(app)
        .post("/users/projects")
        .set(headers)
        .send(payload);

      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty(
        "message",
        `Project name can't be empty`
      );
    });
  });

  describe("User fail to add project because workHours is empty", () => {
    it("should receive status 400 because workHours is empty", async () => {
      const headers = {
        access_token: validToken,
      };
      const payload = {
        name: "workhours",
        totalWorker: 10,
        cost: 2000000,
        UserId: 1,
        CategoryId: 1,
        long: 2901,
        lat: 9303,
      };

      const result = await request(app)
        .post("/users/projects")
        .set(headers)
        .send(payload);

      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty(
        "message",
        `Work Hours can't be empty`
      );
    });
  });

  describe("User fail to add project because total worker is empty", () => {
    it("should receive status 400 because total worker is empty", async () => {
      const headers = {
        access_token: validToken,
      };
      const payload = {
        name: "totalWorker",
        workHours: 10,
        cost: 2000000,
        UserId: 1,
        CategoryId: 1,
        long: 2901,
        lat: 9303,
      };

      const result = await request(app)
        .post("/users/projects")
        .set(headers)
        .send(payload);

      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty(
        "message",
        `Total Worker can't be empty`
      );
    });
  });

  describe("User fail to add project because Cost is empty", () => {
    it("should receive status 400 because Cost is empty", async () => {
      const headers = {
        access_token: validToken,
      };
      const payload = {
        name: "cost",
        workHours: 10,
        totalWorker: 2000000,
        UserId: 1,
        CategoryId: 1,
        long: 2901,
        lat: 9303,
      };

      const result = await request(app)
        .post("/users/projects")
        .set(headers)
        .send(payload);

      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty(
        "message",
        `Cost project can't be empty`
      );
    });
  });

  describe("User fail to add project because Cost is empty", () => {
    it("should receive status 400 because Cost is empty", async () => {
      const headers = {
        access_token: validToken,
      };
      const payload = {
        name: "cost",
        workHours: 10,
        totalWorker: 2000000,
        UserId: 1,
        CategoryId: 1,
        long: 2901,
        lat: 9303,
      };

      const result = await request(app)
        .post("/users/projects")
        .set(headers)
        .send(payload);

      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty(
        "message",
        `Cost project can't be empty`
      );
    });
  });

  describe("User fail to add project because Long / latis empty", () => {
    it("should receive status 400 because Long / lat is empty", async () => {
      const headers = {
        access_token: validToken,
      };
      const payload = {
        name: "long lat",
        cost: 10,
        workHours: 10,
        totalWorker: 2000000,
        UserId: 1,
        CategoryId: 1,
        long: 2901,
      };

      const result = await request(app)
        .post("/users/projects")
        .set(headers)
        .send(payload);

      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty(
        "message",
        `Project location can't be empty`
      );
    });
  });

  describe("Should get error when there is no access_token sent", () => {
    it("should get error 401 and message login first", async () => {
      const payload = {
        name: "tes",
        workHours: 9,
        totalWorker: 10,
        cost: 2000000,
        UserId: 1,
        CategoryId: 1,
        long: 2901,
        lat: 9303,
      };

      const result = await request(app).post("/users/projects").send(payload);
      await expect(result.status).toBe(401);
      await expect(result.body).toHaveProperty("message", "Please login first");
    });
  });

  describe("Should get error when access_token false", () => {
    it("should get error 401 and message login first", async () => {
      const headers = {
        access_token: inValidToken,
      };
      const payload = {
        name: "tes",
        workHours: 9,
        totalWorker: 10,
        cost: 2000000,
        UserId: 1,
        CategoryId: 1,
        long: 2901,
        lat: 9303,
      };
      const result = await request(app)
        .get("/users/projects")
        .set(headers)
        .send(payload);
      await expect(result.status).toBe(401);
      await expect(result.body).toHaveProperty("message", "Please login first");
    });
  });
});
