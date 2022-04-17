//middleware 직접 만들기

//지금 로그인 상태인지 판단
exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) { //true면 로그인이 되어 있는 상태
        next();
    }
    else {
        res.status(403).send('로그인이 안돼있음, 로그인 필요.');
    }
}

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    }
    else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }

}