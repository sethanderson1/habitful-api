const path = require('path');
const express = require('express');
const HabitsService = require('./habits-service');
const { requireAuth } = require('../middleware/jwt-auth');
const habitsRouter = express.Router();
const jsonParser = express.json();

// todo: uncomment const id = 1 when put in requireAuth

habitsRouter
    .route('/')
    .all(requireAuth)
    .get(async (req, res, next) => {
        const { id } = req.user
        const db = req.app.get('db');
        try {
            const habits = await HabitsService
                .getAllHabits(db, id)
            res.json(habits.map(HabitsService.serializeHabit));
        } catch (err) {
            next();
        };
    })
    .post(jsonParser, (req, res, next) => {
        const { id } = req.user
        req.body.user_id = id;
        const { name, description, num_times,
            time_interval, date_created, user_id } = req.body;

        const newHabit = {
            name, description, num_times,
            time_interval, date_created, user_id
        };
        const db = req.app.get('db');

        for (const [key, value] of Object.entries(newHabit)) {
            if (value == null && key !== 'description') {
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                });
            };
        };

        HabitsService.insertHabit(db, newHabit,)
            .then(habit => {
                res
                    .status(201)
                    .location(path.posix.join(
                        req.originalUrl, `/${habit.id}`))
                    .json(HabitsService.serializeHabit(habit))
            })
            .catch(next);
    });

habitsRouter
    .route('/:habit_id')
    .all(requireAuth)
    .all((req, res, next) => {
        const { id } = req.user;
        const { habit_id } = req.params;
        const db = req.app.get('db');
        HabitsService.getById(
            db,
            habit_id
        )
            .then(habit => {
                if (!habit) {
                    return res
                        .status(404)
                        .json({
                            error: {
                                message: `Habit doesn't exist`
                            }
                        })
                };
                if (habit.user_id !== id) {
                    return res.status(403)
                        .json({
                            error: {
                                message: `Forbidden`
                            }
                        });
                };
                res.habit = habit;
                next();
            })
            .catch(next);
    })
    .get((req, res, next) => {
        res.status(200).json(HabitsService
            .serializeHabit(res.habit));
    })
    .delete((req, res, next) => {
        HabitsService.deleteHabit(
            req.app.get('db'),
            req.params.habit_id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { name, description, num_times, time_interval }
            = req.body;
        const habitToUpdate = {
            name, description, num_times, time_interval
        }
        const db = req.app.get('db');

        for (const [key, value] of Object.entries(habitToUpdate)) {
            if (value == null && key !== 'description') {
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                });
            };
        };

        HabitsService.updateHabit(
            db,
            req.params.habit_id,
            habitToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end();
            })
            .catch(next);
    });

module.exports = habitsRouter;