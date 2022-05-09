const router = require('express').Router();
const User = require('../models').User;
const userRepository = require('../repository/user');
const cafeRepository = require('../repository/cafe');

router.get('/', async (req, res)=> {
    
     //기본 main
        const cafes = await userRepository.findCafes();
        const cafe_user = await userRepository.findUser();
        const result = {cafe_user,cafes};
        res.send(result);
    
});

router.get('/geoCoder', async(req,res)=> {

    await cafeRepository.updateCafe();

});

router.post('/gps', async(req,res)=>{
    const {latitude, longitude,nickname} = req.body;
    const my_profile = await userRepository.updateUser(latitude, longitude);
    const cafes = await userRepository.findCafes();
    const distanceResult =  await userRepository.nearCafes(my_profile,cafes);

    const latitude_li = distanceResult.reduce((prev,cur)=> {
        prev.push(cur.latitude);
        return prev;
    },[])

    const longitude_li = distanceResult.reduce((prev,cur)=> {
        prev.push(cur.longitude);
        return prev;
    },[])

    res.json([{
        distanceResult: distanceResult,
    
    }]);
});

module.exports = router;
