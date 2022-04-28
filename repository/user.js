const User = require('../models').User;
const Sequelize = require('Sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// 유저를 찾는
const findUser = async (username)=>{
    const [result, meatadata] = await sequelize.query('SELECT nickname,latitude,longitude  FROM USERS');
    console.log("result : ", result); 
    return result;
}

const findMyProfile = async (username)=>{
    const [result, meatadata] = await sequelize.query(`SELECT nickname,latitude,longitude  FROM USERS WHERE nickname = "${username}"`);
    console.log("result : ", result); 
    return result;
}

// CAFE 전체 정보 가져오는.
const findCafes = async ()=> {
    const [result, meatadata] = await sequelize.query('SELECT cafe_info,location,seat_empty,seat_all,latitude,longitude FROM CAFES');
    // console.log('result', result);
    return result;
}

const nearCafes = async (user,cafes)=> {
    let distanceResult;

    for (let cafe of cafes){ // 거리구하기
        let x = (user[0].latitude - cafe.latitude) *100000.0 *0.884;
        let y = (user[0].longitude - cafe.longitude) *100000.0 *1.110;
        cafe.distance = Math.sqrt((x*x)+(y*y));
    }

    distanceResult = cafes.sort((a,b)=> { //거리순 정렬
        return a.distance - b.distance;
    })
    return distanceResult
}


exports.findUser = findUser;
exports.findCafes = findCafes;
exports.findMyProfile = findMyProfile;
exports.nearCafes = nearCafes;
