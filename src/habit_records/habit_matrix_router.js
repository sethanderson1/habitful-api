const path = require('path');
const express = require('express');
const HabitRecordsService = require('./habit_records-service');
const HabitsService = require('../habits/habits-service');
const { requireAuth } = require('../middleware/jwt-auth');
const habitMatrixRouter = express.Router();
const jsonParser = express.json();


async function getCheckedStatus({startDate, endDate, userID, habitID}){

}


habitMatrixRouter
    // params : startDate: mm-dd-yy, endDate: mm-dd-yy, 
    // habitID: an id or the special value 'all'

    .route('/:startDate/:endDate/:idFilter')
    .all(requireAuth)
    .get(async (req, res, next) => {

        // THIS GETS ALL HABIT records FROM A GIVEN USER
        const { id } = req.user
        const db = req.app.get('db');
        try {
            const habit_records = await HabitRecordsService
                .getAllHabitRecordsByUser(db, id)
            res.json(habit_records)
        } catch (err) {
            // console.log('err', err)
            next();
        };
    })

module.exports = habitMatrixRouter