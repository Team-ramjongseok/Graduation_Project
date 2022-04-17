const router = require('express').Router();
const Payment = require('../models').Payment;
const paymentRepository = require('../repository/payment');
const dotenv = require('dotenv');
const path = require('path')
const axios = require('axios');
const { pool } = require('../models');
dotenv.config();

// 참조 : https://docs.iamport.kr/implementation/payment
// 클라이언트 쪽에서 성공적으로 결제를 완료한 경우, 이쪽으로 와서 post를 실행.
// body에 imp_uid와 merchant_uid를 넣어줘야한다.


router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../views/client_side.html'));
});

// 클라이언트에서 결제가 완료 시, 처리하는 부분.
router.post('/complete', async (req, res, next)=> {

    try {
        const { imp_uid, merchant_uid } = req.body; // req의 body에서 imp_uid, merchant_uid 추출

        // 액세스 토큰(access token) 발급 받기

        const getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "post", // POST method
            headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
            data: {
                imp_key: process.env.IMP_APIKEY, // REST API 키
                imp_secret: process.env.IMP_SECRET // REST API Secret
            }
        });

        // console.log("getToken ===", getToken);
        const { access_token } = getToken.data.response; // 인증 토큰
        // imp_uid로 아임포트 서버에서 결제 정보 조회
        const getPaymentData = await axios({
            url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
            method: "get", // GET method
            headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
        });

        const paymentData = getPaymentData.data.response; // 조회한 결제 정보
        const custom_data = JSON.parse(paymentData.custom_data);
        // paymentData.custom_data가 '{"userId":1,"cafeId":1,"order_list":[2,4],"memo":" 에스프레소 카페인은 빼주세요 ~ "}'
        // 이런식으로 오기때문에 json으로 파싱해야함.

        // DB에서 결제되어야 하는 금액 조회 -> amountToBePaid에 들어감. -> 이게 실제 DB에 등록된 금액
        const amountToBePaid = await paymentRepository.sumMenuPrice(custom_data.order_list); // 결제 되어야 하는 금액

        // 결제 검증하기
        const { amount, status } = paymentData;
        if (amount == amountToBePaid) { // 결제금액 일치. 결제 된 금액 == 결제 되어야 하는 금액, 같다면 결제금액이 위조되지 않은 것임.
            console.log("status === ", status);
            switch (status) {
                case "paid": // 결제 완료
                    // 트랜잭션을 걸어서, 모든 sql 실행.
                    // orders에 order_status (ready) 와 memo (custom_data.memo) , userId (custom_data.userId) 추가
                    // order_detail에 menuId ( custom_data.order_list에 각각의 값들 ) 과 order_id ( orders의 LAST_INSERT_ID() ) 추가
                    // payment에 amount, cafeId, orderId 넣어서 추가.
                    const conn = await pool.getConnection();
                    try {
                        await conn.beginTransaction();
                        const orderId = await paymentRepository.insertOrder('READY', custom_data.memo, custom_data.userId);
                        await paymentRepository.insertOrderDetail(custom_data.order_list, orderId);
                        await paymentRepository.insertPayment(amount, custom_data.cafeId, orderId);
                        await conn.commit();
                        res.send('success');
                    } catch (err) {
                        console.log(err);
                        await conn.rollback();
                        return res.status(500).json(err);
                    } finally {
                        conn.release();
                    }
                    break;
            }
        } else { // 결제금액 불일치. 위/변조 된 결제
          throw { status: "forgery", message: "위조된 결제시도" };
        }

    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }

});

module.exports = router;