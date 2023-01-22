require('dotenv').config();
const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.MYSQL_URI
||
    'tutorial',
    process.env.USERNAME || 'root',
    process.env.PASSWORD || '1234567',
    {
       host: 'localhost',
       dialect: 'mysql'
    }
);

module.exports = sequelize;