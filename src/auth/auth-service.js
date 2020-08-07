const bcrypt = require('bcryptjs');
const xss = require('xss');
const jwt = require('jsonwebtoken');
const config = require('../config');

const AuthService = {

    getUserWithUsername(knex, email) {
        return knex('users')
            .where({ email })
            .first();
    },
    comparePasswords(loginPassword, hashedPassword) {
        return bcrypt.compare(loginPassword, hashedPassword);
    },
    createJwt(subject, payload) {
        return jwt.sign(payload, config.ACCESS_TOKEN_SECRET, {
            subject,
            expiresIn: config.JWT_EXPIRY,
            algorithm: 'HS256'
        });
    },
    verifyJwt(token) {
        return jwt.verify(token, config.ACCESS_TOKEN_SECRET, {
            algorithms: ['HS256']
        });
    }
};

module.exports = AuthService