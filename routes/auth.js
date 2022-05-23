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
    console.log('inner expiration: '+ Math.floor(Date.now()/1000) + (60*60));
    return jwt.sign({email}, process.env.JWT_SECRET, {
        expiresIn: "12h" //만료 12시간
        //expiresIn: Math.floor(Date.now()/1000) + (60*60), //만료 1시간
    });
    
};

//token refresh
const generateRefreshToken = ( email ) => {
    return jwt.sign({ email }, process.env.REFRESH_SECRET, {
        expiresIn: "30day" //만료 한달
        //expiresIn: Math.floor(Date.now()/1000) + (60*60*10) //만료 10시간
    })
}

//신규 회원가입
router.post('/join', async (req, res, next) => {
    const { email, nickname, password, phone } = req.body; //이메일과 패스워드를 바디에 저장
    try {
       const exUser = await User.findOne({where : { email: req.body.email, nickname: req.body.nickname, password: req.body.password, phone:req.body.phone }});
    
       console.log("exUser == ",exUser);
        if(exUser) {
            res.status(405).json({
                message: 'already exist',
            });
        }
        else {
            const hash = await bcrypt.hash(password, 10); //비밀번호는 암호화 해서 저장
            await User.create({
                email,
                nickname,
                password: hash,
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
        const exUser = await User.findOne({ where: {email} });
        if(!exUser) {
            const message= '존재하지 않는 사용자입니다';
            console.log(message);
            res.json({
                message: message
            });
        }
        else {
            console.log(exUser);

            const comparePassword = await bcrypt.compare(password, exUser.password); //암호화된 비밀번호와 비교
            if(comparePassword) {
                console.log(`email: ${email}, password: ${password}`);

                //로그인 성공하면 토큰을 발급
                let accessToken = generateToken(email);
                let refreshToken = generateRefreshToken(email);
                console.log(`aT: ${accessToken}, rT: ${refreshToken}`);
                console.log(`expiresIn: ${accessToken.expiresIn}`);
                res.json({
                    message: 'login success',
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    nickname: exUser.nickname,
                });
            }
            else {
                console.log('비밀번호 틀림');
                res.json({
                    message: 'wrong password'
                });
            }
        }
               
    } catch(error) {
        console.error(error);
        return next(error);
    }
});


//유저 정보를 가져올 부분
router.get('/token', (req, res, next) => {
    if(checkToken(req)) { //if token is valid
        try {
            const user = User.findOne({ where: {email} });
            console.log("token accepted, sent user info");

            res.json({
                nickname: user.nickname,
                email: user.email,
            });
        } catch(err) {
            console.error(err);
            return res.status(405).json({ message: err.message });
        }        
    }
    else {
        res.status(401).json({ message: 'invalid token' });
    }
});



//토큰 검증
//리프레시 토큰 따로 검증해줘야 함
function checkToken(req) {
    const token = req.headers['accessToken'];
    //토큰 검증 성공한 경우
    if(token) { 
        try {
            let decoded = jwt.verify(token, JWT_SECRET);

            return decoded.message === req.params.id;
        } catch(err) {
            return false;
        }
    }
    else { //토큰이 invalid 한 경우
        return false;
    }
}




// //로그아웃
// router.post('/logout', isLoggedIn, (req, res) => {
//     req.logout();
//     req.session.destroy();
//     res.redirect('/');
// });


module.exports = router;
