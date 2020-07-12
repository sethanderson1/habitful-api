const path = require('path');
const express = require('express');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter
    .route('/')
    .post(jsonParser, async (req, res, next) => {
        try {
            const knexInstance = req.app.get('db');
            const { name, email, password } = req.body;
            for (const field of ['name', 'email', 'password']) {
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
                name,
                email,
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