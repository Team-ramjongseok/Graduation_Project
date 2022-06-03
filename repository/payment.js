const {User, Cafe, Payment, Menu, Order, Account, Order_detail} = require('../models');
const Sequelize = require('Sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// 메뉴들의 가격 총합을 내보내주는 메소드 -> 이는 결제금액의 위변조를 막기 위해서 사용.
// input 값으로는 메뉴들의 리스트들. (예를 들어 sumMenuPrice( [2, 4] ) 이런 식으로 들어와야함.)
const sumMenuPrice = async (menu_list)=>{

    let sql = 'SELECT SUM(price) AS S FROM menus WHERE ';
    for(let i = 0; i < menu_list.length; i++) {
        sql += `id = ${menu_list[i]} `;
        if( i != menu_list.length - 1 ) {
            sql += 'OR ';
        }
        else {
            sql += ';';
        }
    }
    // sql문이 SELECT SUM(price) FROM menus WHERE id = 2 OR id = 4 이런식으로 만들어져야함.
    console.log(" sumMenuPrice sql === ", sql);
    const [result, meatadata] = await sequelize.query(sql);

    return result[0].S;
};


// 주문 목록에 주문을 추가하는 함수.
// 상태, 메모값, userId를 input값으로
const insertOrder = async (order_status, memo, userId) => {
    let sql = `INSERT INTO orders (order_status, memo, UserId)
               VALUES ('${order_status}', '${memo}', ${userId});`
    await sequelize.query(sql);

    // INSERT한 order의 id를 조회
    const [result, meatadata] = await sequelize.query(`select LAST_INSERT_ID() AS L;`);

    return result[0].L;
};

// 주문 상세 목록에 주문을 추가하는 함수.
// insertOrderDetail( [2, 4], 1 ); 꼴로 주면 orderDetail에 insert
const insertOrderDetail = async (menu_list, order_id) => {
    let sql = `INSERT INTO order_details (MenuID, OrderId) VALUES `;

    for(let i = 0; i < menu_list.length; i++) {
        if(i == menu_list.length - 1){
            sql += `(${menu_list[i]}, ${order_id})`;
        } else {
            sql += `(${menu_list[i]}, ${order_id}),`;
        }
    }
    sql += ';';

    await sequelize.query(sql);
};


// 계산서에 가격을 추가하는 함수
// 주문할 가격과, cafeId와 orderId를 주면
const insertPayment = async (amount, cafeId, orderId)=> {

    let today = new Date();
    let year = today.getFullYear();
    let month = ('0' + (today.getMonth() + 1)).slice(-2);
    let day = ('0' + today.getDate()).slice(-2);
    let dateString = year + '-' + month  + '-' + day;

    let hours = ('0' + today.getHours()).slice(-2);
    let minutes = ('0' + today.getMinutes()).slice(-2);
    let seconds = ('0' + today.getSeconds()).slice(-2);
    let timeString = hours + ':' + minutes  + ':' + seconds;

    let nowTime = dateString + ' ' + timeString;
    console.log(nowTime);

    let sql = `INSERT INTO payments (order_time, amount, CafeId, OrderId)
               VALUES ('${nowTime}', ${amount}, ${cafeId}, ${orderId});`

    await sequelize.query(sql);
}


const getPaymentByUserId = async (userId)=> {
    const [result, meatadata] = await sequelize.query(
        `
        SELECT P.order_time, P.amount, C.name, C.location, O.order_status
          FROM payments P
          JOIN orders O
            ON P.OrderId = O.id
          JOIN cafes C
            ON C.id = P.CafeId
         WHERE O.UserId = ${userId};
        `
    );
    return result;
}


exports.getPaymentByUserId = getPaymentByUserId;
exports.sumMenuPrice = sumMenuPrice;
exports.insertOrder = insertOrder;
exports.insertOrderDetail = insertOrderDetail;
exports.insertPayment = insertPayment;

