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