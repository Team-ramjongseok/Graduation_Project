const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        try {
            const exUser = await User.findOne({ where: {email} }); //기존 유저인지 확인
            //기존 유저인 경우
            if(exUser) {
                const result = await bcrypt.compare(password, exUser.password); //비밀번호는 암호화 시킨 뒤 비교
                if(result) { //비밀번호 맞은 경우
                    done(null, exUser);
                }
                else { //비밀번호 틀린 경우
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            }
            //기존 유저가 아닌 경우
            else {
                done(null, false, { message: '가입되지 않은 회원입니다.' });
            }
        } catch(error) {
            console.error(error);
            done(error);
        }
    }));
};