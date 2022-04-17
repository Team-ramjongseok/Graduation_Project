const {User, Cafe, Payment, Menu, Order, Account, Order_detail} = require('../models');
const Sequelize = require('Sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// 선택한 카페의 cafeId를 input값으로 넣어주면, 그 카페의 정보, 메뉴 가져오기
const findCafeInfo = async (cafeId)=>{

    const [result, meatadata] = await sequelize.query(
        `SELECT * FROM CAFES C
        JOIN MENUS M 
        ON C.id = M.CafeId
        WHERE C.id = ${cafeId};`
    );
    return result;
}

exports.findCafeInfo = findCafeInfo;

