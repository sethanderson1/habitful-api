const bcrypt = require('bcryptjs');
const xss = require('xss');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
    // getAllUsers(knex) {
    //     return knex.select('*').from('users');
    // },
    hashPassword(password) {
        return bcrypt.hash(password, 10);
    },
    async insertUser(knex, newUser) {
        newUser.email = newUser.email.toLowerCase();
        const insertedUser = await knex
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(rows => {
                return rows[0]
            });

        return insertedUser
    },
    hasUserWithEmail(knex, email) {
        email = email.toLowerCase();
        return knex.select('*')
            .from('users')
            .where({ email })
            .first()
            .then(user => !!user);
    },
    validatePassword(password) {
        if (password.length < 8) {
            return 'Password must be longer than 8 characters';
        };
        if (password.length > 72) {
            return 'Password must be less than 72 characters';
        };
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces';
        };
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain 1 upper case, lower case, number and special character';
        };
    },
    serializeUser(user) {
        const sanitized = {
            email: xss(user.email),
            password: user.password,
            date_created: xss(user.date_created),
        };
        return sanitized
    }
};

module.exports = UsersService