require('dotenv').config();
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    'tutorial',
    process.env.USERNAME,
    process.env.PASSWORD,
    {
       host: 'localhost',
       dialect: 'mysql'
    }
);

module.exports = sequelize;