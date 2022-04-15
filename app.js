const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv'); // 환경변수 관리. .env파일
const passport = require('passport');
const main = require('./routes/main');
const cafe = require('./routes/cafe');

dotenv.config();  // 환경변수 관리. .env파일
const authRouter = require('./routes/auth'); //로그인 위해 auth.js와 연결
const { sequelize } = require('./models');

const app = express();
app.set('port', process.env.PORT || 8001); // 포트 설정. 포트를 나중에 env파일에 넣어줄 것임.

sequelize.sync({ force : true })
    .then(()=> {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err)=> {
        console.log(err);
    });


    
app.use(morgan('dev')); // 로그를 좀 더 구체적으로 보기위해,
app.use(express.static(path.join(__dirname, 'public'))); // css는 정적파일이기 때문에, static으로 설정.
app.use(express.json()); // json 사용.
app.use(express.urlencoded({ extended: true })); // json의 중첩된 객체 허용. qs 모듈이 필요하다.
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/auth', authRouter);

app.use('/main', main);
app.use('/cafe', cafe);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; // 개발할때만 페이지에 에러가 보이도록.
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), ()=> {
    console.log(app.get('port') + '번에서 대기중');
})