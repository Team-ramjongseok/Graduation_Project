const router = require('express').Router();
const User = require('../models').User;
const userRepository = require('../repository/user');
const cafeRepository = require('../repository/cafe');

router.get('/', async (req, res)=> {
    try { 
        const users = await userRepository.findUser();
        const cafes = await cafeRepository.findCafes();
        res.render('main',{users,cafes});       
    } catch (err) {
        console.error(err);
        next(err);
    }
});


module.exports = router;