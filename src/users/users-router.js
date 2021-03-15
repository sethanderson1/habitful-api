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
        console.log('req in get users', req)
        res.status(201).json('hello world')
    })
    .post(jsonParser, async (req, res, next) => {
        console.log('req in post users', req)
        try {
            const knexInstance = req.app.get('db');
            const { email, password, date_created } = req.body;
            for (const field of ['email', 'password']) {
                console.log('field', field)
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
                console.log('password', password)
                return res.status(400).json({
                    error: { message: UsersService.validatePassword(password) }
                });
            };

            // hash password and insert user in database
            const hashedPassword = await UsersService.hashPassword(password);

            console.log('hashedPassword', hashedPassword)
            const newUser = {
                email,
                password: hashedPassword,
                date_created
            };
            console.log('date_created', date_created)

            const sanitizedUser = await UsersService.serializeUser(newUser);
            const user = await UsersService.insertUser(knexInstance, sanitizedUser);
            console.log('user', user)

            res.status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(user);
        } catch (err) {
            console.log('err', err)
            next();
        };
    });

module.exports = usersRouter;