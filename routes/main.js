const router = require('express').Router();
const User = require('../models').User;
const {findUser, hi} = require('../repository/user');

router.get('/', async (req, res)=> {
    const a = await findUser();
    console.log("==============\n a:", a);
    res.send(a);
});

router.get('/cafes', async (req, res)=> {
    const b = await hi();
    console.log("==============\n a:", b);
    res.send(b);
});

module.exports = router;