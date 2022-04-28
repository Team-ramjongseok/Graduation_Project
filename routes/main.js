const router = require('express').Router();
const User = require('../models').User;
const userRepository = require('../repository/user');

router.get('/', async (req, res)=> {
    const cafes = await userRepository.findCafes();
    let {nickname} = req.query;
    
    if (nickname){ // query parameter로 nickname 입력시
        const my_profile = await userRepository.findMyProfile(nickname);
        const distanceResult =  await userRepository.nearCafes(my_profile,cafes);

        res.send({'내정보':my_profile, '가까운순':distanceResult});
    }
    else{ //기본 main
        const cafe_user = await userRepository.findUser();
        const result = {cafe_user,cafes};
        res.send(result);
    }
});

module.exports = router;