// 테이블 추가시 여기에 추가해야함!

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Account = require('./account');
const Cafe = require('./cafe');
const Menu = require('./menu');
const Order = require('./order');
const Payment = require('./payment');
const Order_detail = require('./order_detail');

const db = {};
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);


db.sequelize = sequelize;
db.User = User;
db.Account = Account;
db.Cafe = Cafe;
db.Menu = Menu;
db.Order = Order;
db.Payment = Payment;
db.Order_detail = Order_detail;

User.init(sequelize);
Account.init(sequelize);
Cafe.init(sequelize);
Menu.init(sequelize);
Order.init(sequelize);
Payment.init(sequelize);
Order_detail.init(sequelize);

User.associate(db);
Account.associate(db);

module.exports = db;
