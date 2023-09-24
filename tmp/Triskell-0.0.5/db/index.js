const config = require("../config.json");
const dbConfig = config.database;

const Sequelize = require("sequelize");

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../db.sqlite',

    define: {
        charset: "utf8mb4",
        collate: "utf8mb4_bin",
    },

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.missings = require("./models/missings.js")(sequelize, Sequelize);


module.exports = db;
