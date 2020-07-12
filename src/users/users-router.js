const path = require('path');
const express = require('express');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter
    .route('/')
    .post(jsonParser, async (req, res, next) => {
        console.log('post attempted')

        try {
            const knexInstance = req.app.get('db');
            const { user_name, password } = req.body;
            for (const field of ['user_name', 'password']) {
                if (!req.body[field]) {
                    return res.status(400).json({
                        error: { message: `Missing '${field}' in request body` }
                    });
                };
            };
            // confirm name not already taken
            UsersService.hasUserWithUserName(
                knexInstance,
                user_name
            )
                .then(hasName => {
                    if (hasName) {
                        return res.status(400).json({
                            error: { message: `*Email already in use` }
                        })
                    }
                });

            // validate password
            if (UsersService.validatePassword(password)) {
                return res.status(400).json({
                    error: { message: UsersService.validatePassword(password) }
                });
            };

            // hash password and insert user in database
            const hashedPassword = await UsersService.hashPassword(password);
            const newUser = {
                user_name,
                password: hashedPassword,
            };
            const user = await UsersService.insertUser(knexInstance, newUser);
            res.status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(UsersService.serializeUser(user));
        } catch (err) {
            next();
        };
    });

module.exports = usersRouter;