const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const { queryInterface } = sequelize;

describe("GET CATEGORIES BY ID /users/categories/:id - Include Worker", () => {
  it("should be send data category include worker by id", async () => {
    const id = 1
    const result = await request(app).get(`/users/categories/${id}`);
    expect(result.status).toBe(200)
    expect(result.body).toBeInstanceOf(Object)
    expect(result.body).toHaveProperty("id", id)
    
  });
});
describe("GET CATEGORIES BY ID /users/categories/:id - Error", () => {
  it("should be get 404 and return not found", async () => {
    const id = 7
    const result = await request(app).get(`/users/categories/${id}`);
    expect(result.status).toBe(404)
    expect(result.body).toBeInstanceOf(Object)
    expect(result.body).toHaveProperty("message", "Category not found")
  });
});

describe("GET ALL CATEGORIES", () => {
  it('should should be get status 200 and returning array of categories', async () => {
    const result = await request(app).get("/users/categories")
    expect(result.status).toBe(200)
  });
})