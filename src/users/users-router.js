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
    .get((req,res,next) => {
        res.status(201).json('hello world')
    })
    .post(jsonParser, async (req, res, next) => {
        console.log('post user ran')
        try {
            const knexInstance = req.app.get('db');
            const { email, password, date_created } = req.body;
            console.log('date_created', date_created)
            console.log('password', password)
            console.log('email', email)
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
            
            // const newDate = new Date()
            // console.log('newDate', newDate)
            // const newDateToUtc = dayjs(newDate).utc().format();
            // console.log('newDateToUtc', newDateToUtc)
            // const dateUTC = dayjs().utc().format();
            // console.log('dateUTC', dateUTC)
            
            console.log('users fucking shit router')
            const newUser = {
                email,
                password: hashedPassword,
                date_created
            };

            const sanitizedUser = await UsersService.serializeUser(newUser);
            // const sanitizedUser = newUser;
            const user = await UsersService.insertUser(knexInstance, sanitizedUser);
            console.log('user', user)


            // const ensureUTC = await dayjs(user.date_created).utc().format
            // console.log('ensureUTC', ensureUTC)
            console.log('user.date_created', user.date_created)
            res.status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(user);
        } catch (err) {
            next();
        };
    });

module.exports = usersRouter;