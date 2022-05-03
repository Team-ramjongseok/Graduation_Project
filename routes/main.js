const router = require('express').Router();
const User = require('../models').User;
const userRepository = require('../repository/user');

router.get('/', async (req, res)=> {
    const a = await userRepository.findUser();
    console.log("==============\n a:", a);
    res.send(a);
});

router.get('/cafes', async (req, res, next)=> {
    const b = await userRepository.hi();
    console.log("==============\n a:", b);
    res.send(b);
});
 
module.exports = router;