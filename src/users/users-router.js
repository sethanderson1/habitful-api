const path = require('path');
const express = require('express');
const UsersService = require('./users-service');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
const usersRouter = express.Router();
const jsonParser = express.json();
usersRouter
    .route('/')
    .get((req, res, next) => {
        res.status(201).json('hello world')
    })
    .post(jsonParser, async (req, res, next) => {
        console.log('post user ran')
        try {
            const knexInstance = req.app.get('db');
            const { email, password, date_created } = req.body;
            for (const field of ['email', 'password']) {
                if (!req.body[field]) {
                    return res.status(400).json({
                        error: { message: `Missing '${field}' in request body` }
                    });
                };
            };


            // verify email not taken
            const hasEmail = await UsersService
                .hasUserWithEmail(knexInstance, email)
            if (hasEmail) {
                return res.status(400).json({
                    error: { message: `*Email already in use` }
                });
            };

            // validate password
            if (UsersService.validatePassword(password)) {
                return res.status(400).json({
                    error: { message: UsersService.validatePassword(password) }
                });
            };

            // hash password and insert user in database
            const hashedPassword = await UsersService.hashPassword(password);

            const newUser = {
                email,
                password: hashedPassword,
                date_created
            };

            const sanitizedUser = await UsersService.serializeUser(newUser);
            const user = await UsersService.insertUser(knexInstance, sanitizedUser);

            res.status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(user);
        } catch (err) {
            next();
        };
    });

module.exports = usersRouter;