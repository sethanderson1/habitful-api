const path = require('path');
const express = require('express');
const HabitRecordsService = require('./habit_records-service');
const HabitsService = require('../habits/habits-service');
const { requireAuth } = require('../middleware/jwt-auth');
const habitRecordsRouter = express.Router();
const jsonParser = express.json();

habitRecordsRouter
    .route('/')
    .all(requireAuth)
    .get(async (req, res, next) => {
        console.log('got to habit_records-router get')

        // THIS GETS ALL HABIT records FROM A GIVEN USER
        const { id } = req.user
        const db = req.app.get('db');
        try {
            const habit_records = await HabitRecordsService
                .getAllHabitRecordsByUser(db, id)
            res.json(habit_records)
        } catch (err) {
            console.log('err', err)
            next();
        };
    })
    .post(jsonParser, (req, res, next) => {
        const { date_completed, habit_id } = req.body;
        console.log('req.body', req.body)
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
                    .json(HabitRecordsService
                        .serializeHabitRecord(habitRecord))
            })
            .catch(next);
    });

habitRecordsRouter
    .route('/:habit_id')
    .all(requireAuth)
    .get((req, res, next) => {
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
                res.habit_records = habit_records;
                res.status(200).json(res.habit_records);
            })
            .catch(next);
    })

habitRecordsRouter
    .route('/record/:habit_records_id')
    .all(requireAuth)
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