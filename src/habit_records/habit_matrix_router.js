const path = require('path')
const express = require('express')
const HabitRecordsService = require('./habit_records-service')
const HabitsService = require('../habits/habits-service')
const { requireAuth } = require('../middleware/jwt-auth')
const habitMatrixRouter = express.Router()
const jsonParser = express.json()

async function getHabitsForUser(knex, userID) {
    return knex('habits')
        .where('user_id', userID)
        .select()
}

async function getCheckedStatus(knex, { startDate, endDate, userID, habitID }) {
    const query = knex('habit_records')
    if (habitID) {
        query.where('habit_id', habitID)
    }

    query
        .innerJoin('habits', `habit_records.habit_id`, `habits.id`)
        .where('habits.user_id', userID)

    query
        .whereRaw('DATE(date_completed)>=?::date', startDate)
        .whereRaw('DATE(date_completed)<=?::date', endDate)
        .groupBy('day')
        .orderBy('date_completed_max')
        .select(
            // 'id',

            // this is used to sort the records in chronological order
            knex.raw(`MAX(date_completed) as date_completed_max`),

            // count should be at MOST 1, otherwise you have duplicate records on the same day
            knex.raw('count(habit_records.id) as checked'),

            // format date with postgres
            knex.raw(`to_char("date_completed", 'YYYY-MM-DD') as day`),
        )
    const data = await query
    return data
}


habitMatrixRouter
    // params : startDate: mm-dd-yy, endDate: mm-dd-yy, 
    // habitID: an id or the special value 'all'

    .route('/:startDate/:endDate/:idFilter')
    .all(requireAuth)
    .get(async (req, res, next) => {

        const { startDate, endDate, idFilter } = req.params
        console.log(`idFilter`, idFilter)
        console.log(`startDate`, startDate)
        console.log(`endDate`, endDate)


        // THIS GETS ALL HABIT records FROM A GIVEN USER
        const { id: userID } = req.user
        const db = req.app.get('db')
        try {

            const habits = await getHabitsForUser(db, userID)
            const data = await getCheckedStatus(db,
                {
                    startDate,
                    endDate,
                    userID,
                    habitID: idFilter === 'all' ? null : idFilter
                })

            res.json({
                // habits, 
                data,
            })

        } catch (err) {
            console.error('err', err)
            next()
        }
    })

module.exports = habitMatrixRouter