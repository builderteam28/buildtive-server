const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const { queryInterface } = sequelize;
let validToken;
let invalidToken = "abwdiuabndwkanodnwao"
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
    const headers = {
      access_token : validToken
    }
    const result = await request(app).get(`/users/workers/${id}`).set(headers);
    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Array);
  });
});
describe("GET CATEGORIES BY ID /users/categories/:id - Error", () => {
  it("should be get 404 and return not found", async () => {
    const id = 100;
    const headers = {
      access_token : validToken
    }
    const result = await request(app).get(`/users/workers/100`).set(headers);
    expect(result.status).toBe(404);
    expect(result.body).toBeInstanceOf(Object);
    expect(result.body).toHaveProperty("message", "Category not found");
  });
});
