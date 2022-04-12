const User = require('../models').User;
const Sequelize = require('Sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// 유저를 찾는
const findUser = async (username)=>{
    const result = await User.findAll();
    console.log("result : ", result); 
    return result;
}

// CAFE 전체 정보 가져오는.
const hi = async ()=> {
    const [result, meatadata] = await sequelize.query('SELECT * FROM CAFES');
    console.log('result', result);
    return result;
}


exports.findUser = findUser;
exports.hi = hi;
