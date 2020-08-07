const path = require('path');
const express = require('express');
// const HabitsService = require('./habits-service');
const HabitRecordsService = require('./habit_records-service');
const HabitsService = require('../habits/habits-service');
const { requireAuth } = require('../middleware/jwt-auth');
// const { requireAuth } = require('../middleware/jwt-auth');
const habitRecordsRouter = express.Router();
const jsonParser = express.json();

// todo: uncomment const id = 1 when put in requireAuth
// paths needed:

// route(/)
// get all habit records from user
// post habit record

// route(/habit_id)
// get all habit records from user with specific habit_id

// route(/habit_id/habit_records_id)
// get single habit record
// delete single habit record
// patch single habit record ??

habitRecordsRouter
    .route('/')
    .all(requireAuth)
    .get(async (req, res, next) => {
        console.log('got to habit_records-router get')

        // THIS GETS ALL HABIT records FROM A GIVEN USER
        const { id } = req.user
        console.log('req.user', req.user)
        // req.body.user_id = id;
        const db = req.app.get('db');
        try {
            const habit_records = await HabitRecordsService
                .getAllHabitRecordsByUser(db, id)

            res.json(habit_records)

            // res.json(habit_records
            //     .map(
            //         HabitRecordsService.serializeHabitRecord
            //     )
            // );
        } catch (err) {
            console.log('err', err)

            next();
        };



        // THIS GETS ALL HABIT RECORDS FROM SPECIFIC HABIT ID


    })
    .post(jsonParser, (req, res, next) => {
        // const { id } = req.user
        // req.body.user_id = id;
        const { date_completed, habit_id } = req.body;
        console.log('req.body', req.body)
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
                    .json(HabitRecordsService
                        .serializeHabitRecord(habitRecord))
            })
            .catch(next);
    });

habitRecordsRouter
    .route('/:habit_id')
    .all(requireAuth)
    // .all((req, res, next) => {
    //     // *** uncomment when i add authrouter
    //     // const { id } = req.user
    //     const id = 1;
    //     const { habit_id } = req.params;
    //     const db = req.app.get('db');
    //     HabitRecordsService.getHabitRecordsByHabitId(
    //         db,
    //         habit_id
    //     )
    //         .then(habit_records => {
    //             if (!habit_records) {
    //                 return res
    //                     .status(404)
    //                     .json({
    //                         error: {
    //                             message: `Habit doesn't exist`
    //                         }
    //                     })
    //             };
    //             // todo: do i need a condition for when 
    //             // user tries to manually type in a number in
    //             // the URL for habit_id that they dont own, 
    //             // or will the auth middleware take care of that
    //             // i forgot... think auth takes care of it...

    //             res.habit_records = habit_records;
    //             next();
    //         })
    //         .catch(next);
    // })
    .get((req, res, next) => {
        // *** uncomment when i add authrouter
        // const { id } = req.user
        // const id = 1;
        const { habit_id } = req.params;
        const db = req.app.get('db');
        HabitRecordsService.getHabitRecordsByHabitId(
            db,
            habit_id
        )
            .then(habit_records => {
                if (!habit_records) {
                    return res
                        .status(404)
                        .json({
                            error: {
                                message: `Habit doesn't exist`
                            }
                        })
                };

                console.log('habit_records', habit_records)
                res.habit_records = habit_records;
                res.status(200).json(res.habit_records);
            })
            .catch(next);
    })
// .get((req, res, next) => {
//     res.status(200).json(res.habit_records
//     //     .map(
//     //     HabitRecordsService.serializeHabitRecord
//     // )
//     )
// });

habitRecordsRouter
    // .route('/:habit_id/:habit_records_id')
    .route('/record/:habit_records_id')
    .all(requireAuth)
    // .all((req, res, next) => {
    //     console.log('.all reached')

    //     HabitsService.getById(
    //         req.app.get('db'),
    //         req.params.habit_records_id
    //     )
    //         .then(habit_record => {
    //             console.log('habit_record', habit_record)
    //             if (!habit_record) {
    //                 return res
    //                     .status(404)
    //                     .json({
    //                         error: {
    //                             message: `Habit record doesn't exist`
    //                         }
    //                     })
    //             }
    //             // if (habit_record.author_id !== id) {
    //             //     // console.log('Forbidden path')
    //             //     return res.status(403)
    //             //         .json({
    //             //             error: {
    //             //                 message: `Forbidden`
    //             //             }
    //             //         });
    //             // };
    //             console.log('habit_record', habit_record)
    //             res.habit_record = habit_record;
    //             next();
    //         })
    //         .catch(next);
    // })
    .get((req, res, next) => {


        HabitRecordsService.getHabitRecordsByHabitId(
            req.app.get('db'),
            req.params.habit_records_id
        )
            .then(habit_records => {
                if (!habit_records) {
                    return res
                        .status(404)
                        .json({
                            error: {
                                message: `Habit record doesn't exist`
                            }
                        })
                }
                res.habit_records = habit_records;
                res.status(200).json(res.habit_records);
            })
            .catch(next);


    })
    .delete((req, res, next) => {
        const { habit_records_id } = req.params;
        const id = habit_records_id;
        HabitRecordsService.deleteHabitRecord(
            req.app.get('db'),
            id
        )
            .then(numRowsAffected => {
                res.status(204).end();
            })
            .catch(next)
    })

module.exports = habitRecordsRouter;