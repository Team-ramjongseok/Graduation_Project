
-- 유저 insert문
insert into users (nickname, email, phone, password,latitude,longitude) 
values ('jonghyun', 'a@naver.com', '010-111-1111', 'qwer',37.547623, 127.068183);
insert into users (nickname, email, phone, password,latitude,longitude)
values ('yoon', 'jhb@naver.com', '010-111-1121', 'qwer',37.544065,127.074905);
insert into users (nickname, email, phone, password,latitude,longitude)
values ('wonseok', 'jhb@naver.com', '010-111-1121', 'qwer',37.5450179,127.0690128);

-- 카페 insert문
insert into graduate_project.cafes (name, cafe_img, cafe_info, operation, location, seat_empty, seat_all,latitude,longitude)
values ('starbucks','123', '자양동 스타벅스입니다.', '00:00-08:00', '서울 광진구 자양동', 3, 30,null,null);
insert into graduate_project.cafes (name, cafe_img, cafe_info, operation, location, seat_empty, seat_all,latitude,longitude)
values ('ediya','123', '화양동 이디야입니다.', '00:00-08:00', '서울 광진구 화양동', 15, 50,null,null);
insert into graduate_project.cafes (name, cafe_img, cafe_info, operation, location, seat_empty, seat_all,latitude,longitude)
values ('angelinus','123', '뚝섬역점 엔제리너스입니다.', '00:00-08:00', '서울 성동구 성수동', 25, 70,null,null);
insert into graduate_project.cafes (name, cafe_img, cafe_info, operation, location, seat_empty, seat_all,latitude,longitude)
values ('cafeking','123', '여기는 카페입니다1.', '00:00-08:00', '서울 성동구 성수동', 25, 70,null,null);
insert into graduate_project.cafes (name, cafe_img, cafe_info, operation, location, seat_empty, seat_all,latitude,longitude)
values ('cafequeen','123', '여기는 카페입니다2.', '00:00-08:00', '서울 성동구 성수동', 25, 70,null,null);
select * from graduate_project.cafes;

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