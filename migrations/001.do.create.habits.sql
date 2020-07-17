CREATE TYPE interval_option AS ENUM ('day', 'week', 'month');

CREATE TABLE habits (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name varchar(72) NOT NULL,
    description TEXT,
    num_times INTEGER NOT NULL,
    time_interval interval_option NOT NULL,
    date_created TEXT NOT NULL
);

-- CREATE TYPE interval_option AS ENUM ('day', 'week', 'month');

-- CREATE TABLE habits (
--     id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
--     name varchar(72) NOT NULL,
--     description TEXT,
--     num_times INTEGER NOT NULL,
--     time_interval interval_option NOT NULL,
--     date_created TIMESTAMP DEFAULT now() NOT NULL,
--     date_modified TIMESTAMP DEFAULT now() NOT NULL
-- );