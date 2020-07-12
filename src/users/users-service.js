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
    insertUser(knex, newUser) {
        newUser.email = newUser.email.toLowerCase();
        console.log('insertUser ran')

        return knex
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(rows => {
                return rows[0]
            });
    },
    hasUserWithEmail(knex, email) {
        email = email.toLowerCase();
        console.log('email', email)
        return knex.select('*')
            .from('users')
            .where({email})
            .first()
            .then(user => !!user);
    },
    validatePassword(password) {
        console.log('password', password)
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
        return {
            id: user.id,
            name: xss(user.name),
            email: xss(user.email),
            date_created: user.date_created,
            date_modified: null,
        };
    }
};

module.exports = UsersService