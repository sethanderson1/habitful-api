ALTER TABLE habits 
  DROP COLUMN if exists user_id;

DROP TABLE IF EXISTS users;