SET foreign_key_checks = 0;
DROP TABLE IF EXISTS graduate_project.order_details ;
DROP TABLE IF EXISTS graduate_project.accounts;
DROP TABLE IF EXISTS graduate_project.cafes;
DROP TABLE IF EXISTS graduate_project.menus;
DROP TABLE IF EXISTS graduate_project.orders;
DROP TABLE IF EXISTS graduate_project.users;
DROP TABLE IF EXISTS graduate_project.follow;
DROP TABLE IF EXISTS graduate_project.payments;

-- 지우기 전에 체크 해제한거 다시 체크 해줘야 한다는듯..?
SET foreign_key_checks = 1; 