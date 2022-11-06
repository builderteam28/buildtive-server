const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const { queryInterface } = sequelize;

describe.skip("GET CATEGORIES BY ID /users/categories/:id - Include Worker", () => {
  it("should be send data category include worker by id", async () => {
    const id = 1
    const result = await request(app).get(`/users/categories/${id}`);
    expect(result.status).toBe(200)
    expect(result.body).toBeInstanceOf(Object)
    expect(result.body).toHaveProperty("id", id)
    
  });
});
