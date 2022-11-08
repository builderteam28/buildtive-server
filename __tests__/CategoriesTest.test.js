const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const { queryInterface } = sequelize;
afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Categories", null, {});
});
describe("GET CATEGORIES BY ID /users/categories/:id - Include Worker", () => {
  beforeAll(async () => {
    const categoriesObj = [
      {
        name: "asep",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "asep ke 2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await sequelize.queryInterface.bulkInsert("Categories", categoriesObj, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  });

  afterAll(async () => {
    await sequelize.queryInterface.bulkDelete("Categories", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  });
  it("should be send data category include worker by id", async () => {
    const id = 1;
    const result = await request(app).get(`/users/categories/${id}`);
    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Object);
    expect(result.body).toHaveProperty("id", id);
  });
});
describe("GET CATEGORIES BY ID /users/categories/:id - Error", () => {
  it("should be get 404 and return not found", async () => {
    const id = 7;
    const result = await request(app).get(`/users/categories/${id}`);
    expect(result.status).toBe(404);
    expect(result.body).toBeInstanceOf(Object);
    expect(result.body).toHaveProperty("message", "Category not found");
  });
});

describe("GET ALL CATEGORIES", () => {
  it("should should be get status 200 and returning array of categories", async () => {
    const result = await request(app).get("/users/categories");
    expect(result.status).toBe(200);
  });
});
