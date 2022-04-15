const express = require('express');
const bcrypt = require('bcrpyt');
const passport = require('passport');

const User = require('../models/user');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

//신규 회원가입
router.post('/user/join', isNotLoggedIn, async (req, res, next) => {
    const { email, password } = req.body; //이메일과 패스워드를 바디에 저장
    try {
        const exUser = await User.findOne({ where: { email } }); //이미 가입된 이메일인지 확인
        if(exUser) {
            return res.redirect('/join?error=exist'); //exist라고 뿌려줌
        }
        //기존 유저가 아니면 신규 가입
        const hash = await bcrypt.hash(password, 10); //비밀번호를 bcrypt로 해시화 해서 저장 
        await User.create({
            email,
            nickname,
            //password: hash,
        });
        return res.json({ //회원가입 후 클라이이언트에 {email: '이메일', message: '회원가입 성공'} 을 json 형태로 전송
            'email': email,
            'message': '회원가입 성공',
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

//로그인
router.post('/user/login', isNotLoggedIn, async (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError) { //에러 발생
            console.error(error);
            return next(error);
        }
        if(!user) { //로그인 실패한 경우
            return res.redirect(`/loginError=${info.message}`); //에러 메세지 담아서 프론트에 뿌림
        }
        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }

            return res.json({ //로그인 성공 시 클라이언트에 {message: '로그인 성공', email: '이메일'} 을 json 형태로 전송
                'message': '로그인 성공',
                'email': email,
            });
        });
    }) (req, res, next);
});

//로그아웃
router.post('/user/logout', isLoggedIn, async (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;