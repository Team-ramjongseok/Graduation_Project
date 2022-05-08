const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const path = require('path');

const User = require('../models/user');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();


//access token 생성
const generateToken = ( email ) => {
    return jwt.sign({email}, process.env.JWT_SECRET, {
        expiresIn: "3600", //만료 1시간
    });
};

//token refresh
const refreshToken = ( email ) => {
    return jwt.sign({ email }, process.env.REFRESH_SECRET, {
        expiresIn: "360000" //만료 100시간
    })
}

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
            
            let accessToken = generateToken(email); //토큰 생성
            //console.log(email, nickname, accessToken);
            res.json({
                message: 'join success',
                nickname: req.body.nickname,
                accessToken: accessToken,
            });
        }
        


    } catch (error) {
        console.error(error);
        return next(error);
    }
});


//로그인
router.post('/login', async (req, res, next) => {
    
    const { email, password } = req.body; //클라이언트한테 받은 이메일과 패스워드
    

    try {
        //user가 존재하는지 확인
        const exUser = await User.findOne({ where: {email, password} });
        console.log(exUser);
        if(exUser) {
            console.log(`email: ${email}, password: ${password}`);
            res.json({
                message: 'login success',
            });
        }
        else {
            console.log('fail to login');
            res.json({
                message: 'login fail',
            });
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


module.exports = router;
