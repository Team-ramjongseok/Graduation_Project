const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const path = require('path');

const User = require('../models/user');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();


//신규 회원가입
router.post('/join', async (req, res, next) => {
    const { email, nickname, password, phone } = req.body; //이메일과 패스워드를 바디에 저장
    try {
       const exUser = await User.findOne({where : { email: req.body.email, nickname: req.body.nickname, password: req.body.password, phone:req.body.phone }});
    
       console.log("exUser == ",exUser);
        if(exUser) {
            res.json({
                message: 'already exist',
            });
        }
        else {
            await User.create({
                email,
                nickname,
                password,
                phone,
            });
            res.json({
                message: 'join success',
                nickname: req.body.nickname,
            });
        }
        
        //jwt 이용한 토큰 전송
        // user.token = jwt.sign(user, process.env.JWT_SECRET);
        // res.json({
        //     message: 'join success',
        //     token: user.token
        // })


    } catch (error) {
        console.error(error);
        return next(error);
    }
});


/*
//로그인
router.post('/login', async (req, res, next) => {
    
    const { email, password } = req.body; //클라이언트한테 받은 이메일과 패스워드
    

    try {
        //user가 존재하는지 확인
        const userTemp = await User.findOne({ where: {email, password} });
        console.log(userTemp);
        if(userTemp) {

        }
        // , (err, user) => {

        //     console.log("===user===\n", err, user);
        //     if(err) { //에러 발생한 경우
        //         console.log(`login err: ${err}`);
        //         res.json({ 
        //             message: `error occured: ${err}`,
        //         })
        //     }
        //     else {
        //         if(user) { //로그인 성공한 경우
        //             console.log(`email: ${email}, password: ${password}`);
        //             res.json({
        //                 message: 'login success',
        //                 token: user.token
        //             });
        //         }
        //         else { // 아이디나 비밀번호가 틀렸을 경우
        //             console.log('incorrect id or pw');
        //             res.json({
        //                 message: 'check id/pw',
        //             });
        //         }
        //     }
        // }).catch((err)=>{
        //     console.log(err);
        // });

    } catch(error) {
        console.error(error);
        return next(error);
    }
});

//로그아웃
router.post('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});
*/

module.exports = router;
