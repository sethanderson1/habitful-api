const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

function makeUsersArray() {
  return [
    {
      id: 1,
      email: 'test1@gmail.com',
      password: 'Password1!',
      date_created: dayjs().utc().format()
    },
    {
      id: 2,
      email: 'test2@gmail.com',
      password: 'Password1!',
      date_created: dayjs().utc().format()
    },
    {
      id: 3,
      email: 'test3@gmail.com',
      password: 'Password1!',
      date_created: dayjs().utc().format()
    }
  ]
}

function seedUsers(db, users) {
  const seededUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db
    .into("users")
    .insert(seededUsers)
    .then(() => {
      // update the auto sequence to stay in sync
      return db.raw(`SELECT setval('users_id_seq',?)`, [
        users[users.length - 1].id,
      ]);
    });
}



// make habits

function makeHabitsArray() {
  return [
    {
      id: 1,
      name: 'walk for 1 hour',
      description: 'description',
      num_times: 7,
      time_interval: 'week',
      date_created: '2020-07-01T16:28:32.615',
      user_id: 1
    },
    {
      id: 2,
      name: 'meditate 15 min',
      description: 'description 2',
      num_times: 7,
      time_interval: 'week',
      date_created: '2020-07-01T17:28:32.615',
      user_id: 1
    },
    {
      id: 3,
      name: 'workout',
      description: 'workout',
      num_times: 3,
      time_interval: 'week',
      date_created: '2020-07-01T18:28:32.615',
      user_id: 1
    },
  ]
}

function seedHabits(db, habits) {
  return db
    .into("habits")
    .insert(habits)
    .then(() => {
      // update the auto sequence to stay in sync
      return db.raw(`SELECT setval('habits_id_seq',?)`, [
        habits[habits.length - 1].id,
      ]);
    });
}


function makeHabitRecordsArray() {
  return [
    {
      id: 1,
      date_created: '2020-08-05T07:00:00Z',
      habit_id: 1
    },
    {
      id: 2,
      date_created: '2020-08-06T07:00:00Z',
      habit_id: 1
    },
    {
      id: 3,
      date_created: '2020-08-07T07:00:00Z',
      habit_id: 1
    },
  ]
}

function seedHabitRecords(db, habit_records) {
  return db
    .into("habit_records")
    .insert(habit_records)
    .then(() => {
      // update the auto sequence to stay in sync
      return db.raw(`SELECT setval('habit_records_id_seq',?)`, [
        habit_records[habit_records.length - 1].id,
      ]);
    });
}

function makeAuthHeader(user, secret = process.env.ACCESS_TOKEN_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.email,
    algorithm: "HS256",
  });
  return `Bearer ${token}`;
};

module.exports = {
  makeUsersArray,
  seedUsers,
  makeHabitsArray,
  seedHabits,
  makeHabitRecordsArray,
  seedHabitRecords,
  makeAuthHeader
};