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
              
        -- checked = count by habit.id since the join also filters by user
        -- all SELECT fields must be aggregated because we use GROUP BY
        SELECT calendar_day ,count(h.id) AS checked, Max(hr.id) as habit_record_id
        
        -- debug if needed
        -- , Max(h.id) AS habit_id, Max(h.user_id) AS user_id
        
        -- first SELECT all individual days with generate_series
        FROM  (SELECT generate_series(:startDate, :endDate, '1 day'::interval)::date AS calendar_day)  AS cal_days
        
        -- match the generated days to habit_records
        LEFT JOIN habit_records hr on calendar_day = hr.date_completed and hr.habit_id=:habitID

        -- filter by user 
        LEFT JOIN habits h on h.id = hr.habit_id and h.user_id=:userID
        
        -- group and sort
        GROUP BY calendar_day 
        ORDER BY calendar_day asc 
        `,
        {
            startDate,
            endDate,
            habitID: +habitID, //convert to int
            userID: +userID //convert to int
        }

    )
    // console.log(query.toSQL())

    //NOTE: rows is guaranteed to include all calendar days in chronological order
    const { rows } = await query
    rows.forEach(r => {

        //format calendar days
        r.calendar_day = dayjs(r.calendar_day).utc().format('YYYY-MM-DD')

        //convert checked to int, then to boolean
        r.checked = +r.checked > 0
        if (!r.checked) {
            r.habit_record_id = null
        }
    });
    console.log(rows)
    return rows
}


habitMatrixRouter
    // toggle checked/unchecked
    .route('/toggle/:date/:habitID')
    .all(requireAuth)
    .post(async (req, res, next) => {
        const { id: userID } = req.user
        const { date, habitID } = req.params
        const db = req.app.get('db')
        try {
            //getCheckedStatus return an array (by day), so select the only element
            const current = (await getCheckedStatus(db, {
                startDate: date,
                endDate: date,
                userID,
                habitID,
            }))[0]
            console.log(`current`, current)


            if (current.checked) {
                //uncheck
                await HabitRecordsService
                    .deleteHabitRecord(
                        db,
                        current.habit_record_id
                    )
            }
            else {
                //check
                await HabitRecordsService.insertHabitRecord(db, {
                    date_completed: date,
                    habit_id: habitID,
                })
            }


            //refetch
            const habitRecord = (await getCheckedStatus(db, {
                startDate: date,
                endDate: date,
                userID,
                habitID,
            }))[0]
            res.json({ habitRecord })

        } catch (err) {
            console.error('err', err)
            next()
        }
    })

habitMatrixRouter
    // get a checked matrix for a date range an a habit id (or all habits)

    // params : startDate: yyyy-mm-dd, endDate: yyyy-mm-dd, 
    // habitID: an id or the special value 'all'
    .route('/:startDate/:endDate/:idFilter')
    .all(requireAuth)
    .get(async (req, res, next) => {

        const { startDate, endDate, idFilter } = req.params
        console.log(`idFilter`, idFilter)
        console.log(`startDate`, startDate)
        console.log(`endDate`, endDate)


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