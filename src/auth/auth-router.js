const express = require('express');
const AuthService = require('./auth-service');
const authRouter = express.Router();
const jsonParser = express.json();

authRouter
    .route('/login')
    .post(jsonParser, async (req, res, next) => {
        req.body.email = req.body.email && req.body.email.toLowerCase();
        const { email, password } = req.body;
        const loginUser = { email, password };
        const knexInstance = req.app.get('db');

        for (const field of ['email', 'password']) {
            if (!req.body[field]) {
                return res.status(400).json({
                    error: { message: `Missing '${field}' in request body` }
                });
            };
        };

        try {
            const dbUser = await AuthService
                .getUserWithUsername(
                    knexInstance,
                    loginUser.email
                );

            if (!dbUser) {
                return res.status(400)
                    .json({
                        error: { message: `Incorrect email or password` }
                    });
            };
            const passwordsMatch = await AuthService
                .comparePasswords(
                    loginUser.password,
                    dbUser.password
                );
            if (!passwordsMatch) {
                return res.status(400)
                    .json({
                        error: { message: `Incorrect email or password` }
                    });
            };

            const sub = dbUser.email;
            const payload = { user_id: dbUser.id };

            res.send({
                authToken: AuthService.createJwt(sub, payload)
            });

        } catch (err) {
            // console.log('err', err)
            next();
        };
    });

module.exports = authRouter;