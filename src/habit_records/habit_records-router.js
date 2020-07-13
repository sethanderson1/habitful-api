const path = require('path');
const express = require('express');
// const HabitsService = require('./habits-service');
const HabitRecordsService = require('./habit_records-service');
// const { requireAuth } = require('../middleware/jwt-auth');
const habitRecordsRouter = express.Router();
const jsonParser = express.json();

// todo: uncomment const id = 1 when put in requireAuth

habitRecordsRouter
    .route('/')
    // .all(requireAuth)
    .get(async (req, res, next) => {

        // THIS GETS ALL HABITS FROM A GIVEN USER
        const user_id = 1
        const db = req.app.get('db');
        try {
            const habit_records = await HabitRecordsService
                .getAllHabitRecordsByUser(db, user_id)

            // res.json(habit_records)

            res.json(habit_records.map(
                HabitRecordsService.serializeHabitRecord
            ));
        } catch (err) {
            next();
        };



        // THIS GETS ALL HABIT RECORDS FROM SPECIFIC HABIT ID


    })
    .post(jsonParser, (req, res, next) => {
        // *** uncomment when i add authrouter
        // const { id } = req.user
        const id = 1
        req.body.user_id = id;
        const { date_completed, habit_id } = req.body;
        // console.log('date_completed in router', date_completed)
        const newHabitRecord = { date_completed, habit_id };
        const db = req.app.get('db');

        for (const [key, value] of Object.entries(newHabitRecord)) {
            if (value == null) {
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                });
            };
        };

        HabitRecordsService.insertHabitRecord(db, newHabitRecord)
            .then(habitRecord => {
                res.status(201)
                    .location(path.posix.join(
                        req.originalUrl, `/${habitRecord.id}`))
                    .json(HabitRecordsService.serializeHabitRecord(habitRecord))
            })
            .catch(next);
    });

// habitsRouter
//     .route('/:habit_id')
//     // .all(requireAuth)
//     .all((req, res, next) => {
//         // *** uncomment when i add authrouter
//         // const { id } = req.user
//         const id = 1;
//         const { habit_id } = req.params;
//         const db = req.app.get('db');
//         HabitRecordsService.getById(
//             db,
//             habit_id
//         )
//             .then(habit => {
//                 if (!habit) {
//                     return res
//                         .status(404)
//                         .json({
//                             error: {
//                                 message: `Habit doesn't exist`
//                             }
//                         })
//                 };
//                 if (habit.user_id !== id) {
//                     return res.status(403)
//                         .json({
//                             error: {
//                                 message: `Forbidden`
//                             }
//                         });
//                 };
//                 res.habit = habit;
//                 next();
//             })
//             .catch(next);
//     })
//     .get((req, res, next) => {
//         res.status(200).json(HabitRecordsService.serializeHabit(res.habit));
//     })
//     .delete((req, res, next) => {
//         HabitRecordsService.deleteHabit(
//             req.app.get('db'),
//             req.params.habit_id
//         )
//             .then(numRowsAffected => {
//                 res.status(204).end()
//             })
//             .catch(next)
//     })
//     .patch(jsonParser, (req, res, next) => {
//         const { name, description, num_times, time_unit }
//             = req.body;
//         const habitToUpdate = {
//             name, description, num_times, time_unit
//         }
//         const db = req.app.get('db');

//         for (const [key, value] of Object.entries(habitToUpdate)) {
//             if (value == null && key !== 'description') {
//                 return res.status(400).json({
//                     error: {
//                         message: `Missing '${key}' in request body`
//                     }
//                 });
//             };
//         };

//         HabitRecordsService.updateHabit(
//             db,
//             req.params.habit_id,
//             habitToUpdate
//         )
//             .then(numRowsAffected => {
//                 res.status(204).end();
//             })
//             .catch(next);
//     });

module.exports = habitRecordsRouter
