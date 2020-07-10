require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const knex = require('./db')()

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.get('/', async (req, res) => {
    console.log(knex)
    const records = await knex
    .table('habit_records')
    .innerJoin('habits', `habit_records.habit_id`, `habits.id`)
    //filter by record date
    .where('habit_records.date_completed', '2020-07-12 22:52:05')
    .select(['habits.habit_name', 'habit_records.date_completed'])
    res.send(JSON.stringify({records}))

    // res.send('Hello, world!')
})

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