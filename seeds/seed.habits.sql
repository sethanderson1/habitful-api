INSERT INTO habits (id, habit_name, description, num_times, unit_time, dates_completed, date_created, date_modified)
VALUES 
(1,
'walk for 1 hour',
null, 
1, 
'day', 
'{2020-07-02T05:55:03.510Z,
2020-07-03T05:55:03.510Z,
2020-07-06T05:55:03.510Z}',
'2020-07-01T16:28:32.615Z',
null),
(2,
'meditate 15 min',
null, 
1, 
'day', 
'{2020-07-02T05:55:03.510Z,
2020-07-05T05:55:03.510Z,
2020-07-06T05:55:03.510Z}',
'2020-07-01T16:28:32.615Z',
null),
(3,
'drink 2L water',
null, 
1, 
'day', 
'{2020-07-03T05:55:03.510Z,
2020-07-05T05:55:03.510Z,
2020-07-06T05:55:03.510Z}',
'2020-07-01T16:28:32.615Z',
null);


-- ensures id generator will start from the max id num in database
-- instead of starting at 1
SELECT setval('habits_id_seq', (SELECT MAX(id) from "habits"));