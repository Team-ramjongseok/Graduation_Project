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


// 선택한 카페의 주문 현황을 가져오는 메소드. 선택한 카페의 cafeId를 input값으로 줌.
const findCafePayment = async (cafeId) => {

    const [result, meatadata] = await sequelize.query(
        `
        SELECT P.id, P.order_time, P.amount, O.order_status, O.memo, U.nickname, GROUP_CONCAT(M.name SEPARATOR ', ') AS name
        FROM payments P
        JOIN orders O
        ON P.OrderId = O.id
        JOIN users U
          ON O.UserId = U.id
        JOIN order_details D
          ON D.OrderId = O.id
        JOIN menus M
          ON M.id = D.MenuId
        WHERE P.CafeId = ${cafeId}
        GROUP BY P.id ;
        `
    )
    return result;
}

// cafeId를 input값으로 ready의 상태를 가지고 있는 payment의 정보 출력
const findCafePaymentReady = async (cafeId) => {

  const [result, meatadata] = await sequelize.query(
      `
      SELECT P.id, P.order_time, P.amount, O.order_status, O.memo, U.nickname, P.OrderId, GROUP_CONCAT(M.name SEPARATOR ', ') AS name
      FROM payments P
      JOIN orders O
      ON P.OrderId = O.id
      JOIN users U
        ON O.UserId = U.id
      JOIN order_details D
        ON D.OrderId = O.id
      JOIN menus M
        ON M.id = D.MenuId
      WHERE P.CafeId = ${cafeId} AND O.order_status = 'READY'
      GROUP BY P.id ;
      `
  )
  return result;
}

// cafeId를 input값으로 comp의 상태를 가지고 있는 payment의 정보 출력
const findCafePaymentComplete = async (cafeId) => {

  const [result, meatadata] = await sequelize.query(
      `
      SELECT P.id, P.order_time, P.amount, O.order_status, O.memo, U.nickname, GROUP_CONCAT(M.name SEPARATOR ', ') AS name
      FROM payments P
      JOIN orders O
      ON P.OrderId = O.id
      JOIN users U
        ON O.UserId = U.id
      JOIN order_details D
        ON D.OrderId = O.id
      JOIN menus M
        ON M.id = D.MenuId
      WHERE P.CafeId = ${cafeId} AND O.order_status = 'COMP'
      GROUP BY P.id ;
      `
  )
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

// cafeId를 input값으로 check의 상태를 가지고 있는 payment의 정보 출력
const findCafePaymentCheck = async (cafeId) => {
  
  const [result, meatadata] = await sequelize.query(
      `
      SELECT P.id, P.order_time, P.amount, O.order_status, O.memo, U.nickname, P.OrderId, GROUP_CONCAT(M.name SEPARATOR ', ') AS name
      FROM payments P
      JOIN orders O
      ON P.OrderId = O.id
      JOIN users U
        ON O.UserId = U.id
      JOIN order_details D
        ON D.OrderId = O.id
      JOIN menus M
        ON M.id = D.MenuId
      WHERE P.CafeId = ${cafeId} AND O.order_status = 'CHECK'
      GROUP BY P.id ;
      `
  )
  return result;
}

// order_status를 check에서 ready로 바꾸는 함수
const updateOrderCheckToReady = async (orderId) => {
  const [result, meatadata] = await sequelize.query(
    `
    UPDATE orders
       SET order_status = 'READY'
     WHERE id=${orderId};
    `
  )
  return result;
}

// order_status를 ready에서 comp로 바꾸는 함수
const updateOrderReadyToComp = async (orderId) => {
  const [result, meatadata] = await sequelize.query(
    `
    UPDATE orders
       SET order_status = 'COMP'
     WHERE id= ${orderId};
    `
  )
  return result;
}

// cafeId 기준으로 현재 주문 상태별로 count해주는 함수
const getStatusCount = async (cafeId) => {

  const [result, meatadata] = await sequelize.query(
      `
      SELECT O.order_status, COUNT(O.order_status) AS count
        FROM payments P
        JOIN orders O
          ON P.OrderId = O.id
       WHERE P.CafeId = ${cafeId}
       GROUP BY O.order_status;
      `
  )
  return result;
}


exports.findCafeInfo = findCafeInfo;
exports.findCafePayment = findCafePayment;
exports.findCafePaymentCheck = findCafePaymentCheck;
exports.findCafePaymentComplete = findCafePaymentComplete;
exports.findCafePaymentReady = findCafePaymentReady;
exports.updateOrderCheckToReady = updateOrderCheckToReady;
exports.updateOrderReadyToComp = updateOrderReadyToComp;
exports.getStatusCount = getStatusCount;
exports.findCafeInfo = findCafeInfo;
exports.updateCafe = updateCafe;