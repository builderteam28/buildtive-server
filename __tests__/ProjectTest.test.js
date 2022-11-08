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
  // console.log(projects)
  // await Project.bulkCreate(projects)
  await sequelize.queryInterface.bulkInsert(
    "Categories",
    [
      { name: "asep 2", createdAt: new Date(), updatedAt: new Date() },
      { name: "Jajang", createdAt: new Date(), updatedAt: new Date() },
      { name: "dudi", createdAt: new Date(), updatedAt: new Date() },
    ],
    {}
  );
  await sequelize.queryInterface.bulkInsert("Projects", projects, {})
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
  await sequelize.queryInterface.bulkDelete("Categories", null, {
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
      await expect(result.body).toHaveProperty("Category", expect.any(Object));
    });
  });
  describe("get project with wrong id in params", () => {
    it("should get error 404", async () => {
      const headers = {
        access_token: validToken,
      };
      const id = 100;
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
      const payload = require("../data/db.json").projects[0];

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
        totalWorker: 10,
        cost: 2000000,
        UserId: 1,
        CategoryId: 1,
        long: 2901,
        lat: 9303,
        description: "lorem ipsum",
        address: "lorem ipsum",
        tenor: 3,
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
        description: "lorem ipsum",
        address: "lorem ipsum",
      };

      const result = await request(app)
        .post("/users/projects")
        .set(headers)
        .send(payload);

      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty(
        "message",
        `Project tenor can't be empty`
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
        tenor: 10,
        cost: 2000000,
        UserId: 1,
        CategoryId: 1,
        long: 2901,
        lat: 9303,
        description: "lorem ipsum",
        address: "lorem ipsum",
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
        tenor: 10,
        totalWorker: 2000000,
        UserId: 1,
        CategoryId: 1,
        long: 2901,
        lat: 9303,
        description: "lorem ipsum",
        address: "lorem ipsum",
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
        tenor: 10,
        totalWorker: 2000000,
        UserId: 1,
        CategoryId: 1,
        long: 2901,
        lat: 9303,
        description: "lorem ipsum",
        address: "lorem ipsum",
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

  describe("User fail to add project because Long / lat is empty", () => {
    it("should receive status 400 because Long / lat is empty", async () => {
      const headers = {
        access_token: validToken,
      };
      const payload = {
        name: "long lat",
        cost: 10,
        tenor: 10,
        totalWorker: 2000000,
        UserId: 1,
        CategoryId: 1,
        long: 2901,
        description: "lorem ipsum",
        address: "lorem ipsum",
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
        tenor: 9,
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
        tenor: 9,
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
  describe("Should get error when read access_token", () => {
    it("should get respond status 401 and returning Please login first", async () => {
      const headers = {
        access_token: inValidToken,
      };
      const id = 1;
      const result = await request(app)
        .delete(`/users/projects/${id}`)
        .set(headers);
      expect(result.status).toBe(401);
      expect(result.body).toHaveProperty("message", "Please login first");
    });
  });
  describe("Should get error when update Project", () => {
    it("should get respond status 401 and returning Please login first", async () => {
      const dataUpdate = {
        name: "asep update",
        tenor: 5,
        totalWorker: 4,
        cost: 20000,
        status: "active",
      };
      const headers = {
        access_token: inValidToken,
      };
      const id = 1;
      const result = await request(app)
        .put(`/users/projects/${id}`)
        .set(headers)
        .send(dataUpdate);
      expect(result.status).toBe(401);
      expect(result.body).toHaveProperty("message", "Please login first");
    });
  });
  describe("Should get error cause send the wrong id", () => {
    it("should get respond status 404 and Project Not Found", async () => {
      const dataUpdate = {
        name: "asep update",
        tenor: 5,
        totalWorker: 4,
        cost: 20000,
        status: "active",
      };
      const headers = {
        access_token: validToken,
      };
      const id = 9;
      const result = await request(app)
        .put(`/users/projects/${id}`)
        .set(headers)
        .send(dataUpdate);
      expect(result.status).toBe(404);
      expect(result.body).toHaveProperty("message", "Project not found");
    });
  });
});

describe("UPDATE /users/projects/:id", () => {
  it("success edit product", async () => {
    const headers = {
      access_token: validToken,
    };
    const payload = require("../data/db.json").projects[0];

    const result = await request(app)
      .put(`/users/projects/2`)
      .set(headers)
      .send(payload);

    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty("message", `Project already updated`);
  });
  it("fail because project with id in params not found", async () => {
    const headers = {
      access_token: validToken,
    };
    const payload = require("../data/db.json").projects[0];

    const result = await request(app)
      .put(`/users/projects/9`)
      .set(headers)
      .send(payload);

    expect(result.status).toBe(404);
    expect(result.body).toHaveProperty("message", `Project not found`);
  });
});

describe("GET accept worker", () => {
  it("success accept worker", async () => {});
});
