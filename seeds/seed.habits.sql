SET timezone="UTC";
BEGIN;


-- todo: had issue with duplicate key error when inserting into 
-- habit_records. Need to sort out how setval thing works and 
-- ensure it preents this type of error.

TRUNCATE
habit_records,
habits,
users
RESTART IDENTITY CASCADE;

INSERT INTO users (id, name, email, password, date_created, date_modified)
VALUES 
-- all passwords are 'Password1!'
(1,'John', 'user1@gmail.com', '$2a$10$do9aqSHBEOX2mmidBFxxPOdknoul45m.TDoeQkdumVNrEkF2sn3KK', '2020-07-01T16:28:32.615','2020-07-01T16:28:32.615'),
(2,'Mary', 'user2@gmail.com', '$2a$10$4AGfWWmypn45VHgsdyMOY.xymoQInQIwtzbFWeyvUvWVknpeSWwki', '2020-07-01T17:28:32.615','2020-07-01T17:28:32.615'),
(3,'Bob', 'user3@gmail.com', '$2a$10$XrZZWlImZXIhAIf7b.8xqeDNK6kDU81An9lU.XzsuvgtR7hyG43fm', '2020-07-01T18:28:32.615','2020-07-01T18:28:32.615');

SELECT setval('users_id_seq', (SELECT MAX(id) from "users"));

INSERT INTO habits (id, name, description, num_times, time_interval, date_created, date_modified, user_id)
VALUES 
(1,
'walk for 1 hour',
null, 
1, 
'day', 
'2020-07-01T16:28:32.615',
'2020-07-01T16:28:32.615',
1),
(2,
'meditate 15 min',
null, 
1, 
'day', 
'2020-07-02T16:28:32.615',
'2020-07-02T16:28:32.615',
1),
(3,
'workout',
null, 
3, 
'week', 
'2020-07-03T16:28:32.615',
'2020-07-03T16:28:32.615',
1);

-- ensures id generator will start from the max id num in database
-- instead of starting at 1
SELECT setval('habits_id_seq', (SELECT MAX(id) from "habits"));


INSERT INTO habit_records (id, date_completed, habit_id)
VALUES 
(1,'2020-07-03T16:28:32.615Z',1),
(2,'2020-07-04T16:28:32.615Z',1),
(3,'2020-07-06T16:28:32.615Z',1);

SELECT setval('habit_records_id_seq', (SELECT MAX(id) from "habit_records"));


-- do something with the below
-- SELECT * FROM habits INNER JOIN habit_records ON habit_records.habit_id=habits.id;

COMMIT;