const request = require("supertest");
const app = require("../app");
const { Payment, sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const { queryInterface } = sequelize;

