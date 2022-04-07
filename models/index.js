// 테이블 추가시 여기에 추가해야함!

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Account = require('./account');

const db = {};
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);


db.sequelize = sequelize;
db.User = User;
db.Account = Account;

User.init(sequelize);
Account.init(sequelize);

// User.associate(db);

module.exports = db;
