const router = require('express').Router();
const User = require('../models').User;
const cafeRepository = require('../repository/cafe');

// body에 cafeId를 넣어 보내는 경우, 그 cafeId를 기준으로 메뉴와 가게정보 보냄.
router.get('/', async (req, res, next)=> {

    try{
        if(req.body.cafeId){
            const result = await cafeRepository.findCafeInfo(req.body.cafeId);
            res.json(result);
        }
        else {  // body에 cafeId값이 존재하지 않는 경우
            res.status(404).send('잘못된 접근입니다');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }

});

module.exports = router;