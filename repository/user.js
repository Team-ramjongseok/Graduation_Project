const User = require('../models').User;
const Sequelize = require('Sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// 유저를 찾는
const findUser = async ()=>{
    const result = await User.findAll({
        attributes: ['nickname','email','phone'],
    });
    return result;
}

exports.findUser = findUser;
