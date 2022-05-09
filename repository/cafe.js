const {User, Cafe, Payment, Menu, Order, Account, Order_detail} = require('../models');
const nodeGeocoder = require('node-geocoder');
const Sequelize = require('Sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const dotenv = require('dotenv');

dotenv.config();  // 환경변수 관리. .env파일

const options = {
    provider:'google',
    apiKey: process.env.APIKEY,
};

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

const updateCafe = async ()=> {
    let sql = ("SELECT location  FROM cafes where latitude is NULL and  longitude is NULL;");
    const [cafes, meatadata] = await sequelize.query(sql);
    const geocoder = nodeGeocoder(options);

    for (let cafe of cafes) {
        const locationName = cafe.location;
        console.log(locationName);

        try {
            const regionLatLongResult = await geocoder.geocode(locationName);
            const latitude = regionLatLongResult[0].latitude; //위도
            const longitude =  regionLatLongResult[0].longitude //경도
    
            sql = (`UPDATE CAFES SET latitude=${latitude}, longitude=${longitude} WHERE location="${locationName}";`);
            await sequelize.query(sql);
        }  catch (error) {
            console.error(error);
            return next(error);
        }
    }


}

exports.findCafeInfo = findCafeInfo;
exports.updateCafe = updateCafe;

