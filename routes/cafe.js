const router = require('express').Router();
const User = require('../models').User;
const cafeRepository = require('../repository/cafe');

// params에 cafeId를 넣어 보내는 경우, 그 cafeId를 기준으로 메뉴와 가게정보 보냄.
router.get('/', async (req, res, next)=> {
    
    try{
        if(req.query.cafeId){
            const result = await cafeRepository.findCafeInfo(req.query.cafeId);
            res.json(result);
        }
        else {  // params에 cafeId값이 존재하지 않는 경우
            
            res.status(404).send('잘못된 접근입니다');
        }
    } catch (error) {   
        console.error(error);
        next(error);
    }
});

// params에 cafeId를 넣어 보내는 경우, 그 cafeId를 기준으로 총 결산 현황을 보내줌.
router.get('/payments', async (req, res, next)=> {
    console.log(req.query.cafeId);
    try{
        if(req.query.cafeId){
            const result = await cafeRepository.findCafePayment(req.query.cafeId);
            res.json(result);
        }
        else {  // params에 cafeId값이 존재하지 않는 경우
            res.status(404).send('잘못된 접근입니다');
        }
    } catch (error) {   
        console.error(error);
        next(error);
    }
});

router.get('/payments/ready', async (req, res, next)=> {
    console.log(req.query.cafeId);
    try{
        if(req.query.cafeId){
            const result = await cafeRepository.findCafePaymentReady(req.query.cafeId);
            res.json(result);
        }
        else {  // params에 cafeId값이 존재하지 않는 경우
            res.status(404).send('잘못된 접근입니다');
        }
    } catch (error) {   
        console.error(error);
        next(error);
    }
});

router.get('/payments/check', async (req, res, next)=> {
    console.log(req.query.cafeId);
    try{
        if(req.query.cafeId){
            const result = await cafeRepository.findCafePaymentCheck(req.query.cafeId);
            res.json(result);
        }
        else {  // params에 cafeId값이 존재하지 않는 경우
            res.status(404).send('잘못된 접근입니다');
        }
    } catch (error) {   
        console.error(error);
        next(error);
    }
});

router.get('/payments/complete', async (req, res, next)=> {
    console.log(req.query.cafeId);
    try{
        if(req.query.cafeId){
            const result = await cafeRepository.findCafePaymentComplete(req.query.cafeId);
            res.json(result);
        }
        else {  // params에 cafeId값이 존재하지 않는 경우
            res.status(404).send('잘못된 접근입니다');
        }
    } catch (error) {   
        console.error(error);
        next(error);
    }
});


router.get('/payments/status', async (req, res, next)=> {
    console.log(req.query.cafeId);
    try{
        if(req.query.cafeId){
            const result = await cafeRepository.getStatusCount(req.query.cafeId);
            res.json(result);
        }
        else {  // params에 cafeId값이 존재하지 않는 경우
            res.status(404).send('잘못된 접근입니다');
        }
    } catch (error) {   
        console.error(error);
        next(error);
    }
});



router.post('/payments/post/check', async (req, res, next) => {
    console.log(req.body, req.body.orderId);

    try{
        if(req.body.orderId){
            const result = await cafeRepository.updateOrderCheckToReady(req.body.orderId);
            console.log(result);
            res.send("success");
        }
        else {  // params에 cafeId값이 존재하지 않는 경우
            res.status(404).send('잘못된 접근입니다');
        }
    } catch (error) {   
        console.error(error);
        next(error);
    }

});


router.post('/payments/post/ready', async (req, res, next) => {
    console.log(req.body, req.body.orderId);

    try{
        if(req.body.orderId){
            const result = await cafeRepository.updateOrderReadyToComp(req.body.orderId);
            console.log(result);
            res.send("success");
        }
        else {  // params에 cafeId값이 존재하지 않는 경우
            res.status(404).send('잘못된 접근입니다');
        }
    } catch (error) {   
        console.error(error);
        next(error);
    }
    
});




module.exports = router;