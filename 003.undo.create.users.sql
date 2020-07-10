ALTER TABLE categories 
  DROP COLUMN if exists author_id;
  
ALTER TABLE recipes 
  DROP COLUMN if exists author_id;

DROP TABLE IF EXISTS users;