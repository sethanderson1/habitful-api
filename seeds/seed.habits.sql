
INSERT INTO habits (id, habit_name, description, num_times, unit_time, dates_accomplished, date_created, date_modified)
VALUES 
(1,
'meditate 15 min',
null, 
1, 
'day', 
'{2020-07-2T05:55:03.510Z,
2020-07-3T05:55:03.510Z,
2020-07-6T05:55:03.510Z}',
'2020-07-01T16:28:32.615Z',
null);


-- (2,
-- 'walk an hour',
-- null, 
-- 1, 
-- 'day', 
-- {'2020-07-01T16:29:32.615Z',
-- '2020-07-02T16:28:32.615Z',
-- '2020-07-05T16:28:32.615Z'},
-- '2020-07-01T16:28:32.615Z',
-- null),
-- (3,
-- 'sleep 8 hours',
-- null, 
-- 1, 
-- 'day', 
-- ['2020-07-01T16:29:32.615Z',
-- '2020-07-02T16:28:32.615Z',
-- '2020-07-05T16:28:32.615Z'],
-- '2020-07-01T16:28:32.615Z',
-- null);


-- ensures id generator will start from the max id num in database
-- instead of starting at 1
SELECT setval('habits_id_seq', (SELECT MAX(id) from "habits"));