
-- 유저 insert문
insert into users (nickname, email, phone, password) 
values ('jonghyun', 'a@naver.com', '010-111-1111', 'qwer');
insert into users (nickname, email, phone, password)
values ('yoon', 'jhb@naver.com', '010-111-1121', 'qwer');

-- 카페 insert문
insert into cafes (name, cafe_img, cafe_info, operation, location, seat_empty, seat_all)
values ('starbucks','123', '자양동 스타벅스입니다.', '00:00-08:00', '서울 광진구 자양동', 3, 30);
insert into cafes (name, cafe_img, cafe_info, operation, location, seat_empty, seat_all)
values ('starbucks','123', '화양동 스타벅스입니다.', '00:00-08:00', '서울 광진구 화양동', 15, 50);
select * from cafes;

-- 메뉴 insert문
insert into menus (name, price, CafeId)
values ('아이스 아메리카노', 5000, 1);
insert into menus (name, price, CafeId)
values ('아이스 아메리카노', 5000, 2);
insert into menus (name, price, CafeId)
values ('에스프레소', 4000, 1);
insert into menus (name, price, CafeId)
values ('청포도 에이드', 6000, 2);
insert into menus (name, price, CafeId)
values ('딸기 에이드', 6000, 2);
insert into menus (name, price, CafeId)
values ('달고나 라떼', 8000, 1);
insert into menus (name, price, CafeId)
values ('아이스 라떼', 5500, 1);
select * from menus;