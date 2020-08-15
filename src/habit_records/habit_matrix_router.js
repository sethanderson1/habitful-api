const path = require('path')
const express = require('express')
const HabitRecordsService = require('./habit_records-service')
const HabitsService = require('../habits/habits-service')
const { requireAuth } = require('../middleware/jwt-auth')
const habitMatrixRouter = express.Router()
const jsonParser = express.json()
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc)

async function getHabitsForUser(knex, userID) {
    return knex('habits')
        .where('user_id', userID)
        .select()
}

async function _getCheckedStatusWithGaps(knex, { startDate, endDate, userID, habitID }) {
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
            // knex.raw(`to_char("date_completed", 'YYYY-MM-DD') as day`),
            knex.raw(`"date_completed"::date as day`),
        )
    // query.joinRaw(
    //     `RIGHT JOIN 
    //         (select (generate_series(?, ?, '1 day'::interval))::date) as calendar_day 
    //         on calendar_day::date = habit_records.date_completed::date 
    //         `,
    //     [startDate,
    //         endDate]
    // )

    const data = await query

    return data
}


async function getCheckedStatus(knex, { startDate, endDate, userID, habitID }) {

    if (!habitID) {
        // need data for all habits
        const habitIDs = (await getHabitsForUser(knex, userID))
            .map(h => h.id)
        let promises = []
        let returnValue = {}
        habitIDs.forEach(id => {
            const promise = getCheckedStatus(
                knex,
                { startDate, endDate, userID, habitID: id }
            )
                .then(data => returnValue[id] = data)

            promises.push(promise)
        })
        await Promise.all(promises)
        return returnValue
    }

    const query = knex.raw(
        `
        
        select 
        --- checked = count by habit.id since the join also filters by user
        calendar_day ,count(h.id) as checked
        
        -- debug if needed
        -- , Max(h.id) as habit_id, Max(h.user_id) as user_id
        
        -- first select all individual days with generate_series
        from  (select generate_series(:startDate, :endDate, '1 day'::interval)::date as calendar_day)  as cal_days
        
        -- match the generated days to habit_records
        left join habit_records hr on calendar_day = hr.date_completed and hr.habit_id=:habitID

        -- filter by user 
        left join habits h on h.id = hr.habit_id and h.user_id=:userID
        
        -- group and sort
        group by calendar_day 
        order by calendar_day asc 
        `,
        {
            startDate,
            endDate,
            habitID: +habitID,
            userID: +userID
        }

    )
    // console.log(query.toSQL())

    //rows is guaranteed to include all calendar days in chronological order
    const { rows } = await query
    rows.forEach(r => {
        r.calendar_day = dayjs(r.calendar_day).utc().format('YYYY-MM-DD')
        r.checked = +r.checked === 1
    });
    console.log(rows)
    return rows
}


habitMatrixRouter
    // params : startDate: yyyy-mm-dd, endDate: yyyy-mm-dd, 
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