require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const dayjs = require('dayjs');
const { CLIENT_ORIGIN } = require('./config');


const usersRouter = require('./users/users-router');
// const authRouter = require('./auth/auth-router');
const habitsRouter = require('./habits/habits-router');
const habitRecordsRouter = require('./habit_records/habit_records-router');
const habitMatrixRouter = require('./habit_records/habit_matrix_router');
const authRouter = require('./auth/auth-router');

const app = express();

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';
app.use(morgan(morganOption));
app.use(helmet());  
app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);
app.use(`/api/users`, usersRouter);
app.use(`/api/habits`, habitsRouter);
app.use(`/api/habit-records`, habitRecordsRouter);

app.use(`/api/habit-matrix`, habitMatrixRouter);

app.use(`/api/auth`, authRouter);

// app.get('/', async (req, res) => {
//     const records = await knex
//         // look at the records
//         .from('habit_records')
//         //and join with habits in order to get habit name, etc.
//         .innerJoin('habits', `habit_records.habit_id`, `habits.id`)
//         //filter by record date. and by interval es^pecially
//         // .where('habit_records.date_completed', '2020-07-12 22:52:05')
//         .select(['habits.name', 'habit_records.date_completed']);
//     res.send(JSON.stringify({ records }));
// })

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app