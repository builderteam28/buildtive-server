const request = require("supertest");
const app = require("../app");
const { User, sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const { queryInterface } = sequelize;

