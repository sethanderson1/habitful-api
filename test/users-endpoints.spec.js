const knex = require('knex');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc)

describe('Users Endpoints', () => {

    const testUsers = helpers.makeUsersArray()

    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => db.raw(
        `TRUNCATE
            users
            RESTART IDENTITY CASCADE`
    ))

    afterEach('cleanup', () => db.raw(
        `TRUNCATE
            users
            RESTART IDENTITY CASCADE`
    ))

    beforeEach('insert users', () => helpers.seedUsers(db, testUsers));

    describe('POST /api/users', () => {
        ['email', 'password'].forEach(field => {
            const newUser = {
                email: 'testUser1@gmail.com',
                password: 'Password1!',
            };

            it(`Responds with '400 missing ${field}' if not supplied`, () => {
                delete newUser[field]

                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(400, {
                        error: { message: `Missing '${field}' in request body` }
                    })
            });
        });

        it(`responds with 400 error when email already exists`, () => {
            const newUser = {
                email: testUsers[0].email,
                password: 'Password1!',
            };
            return supertest(app)
                .post('/api/users/')
                .send(newUser)
                .expect(400, {
                    error: { message: `*Email already in use` }
                })
        })

        context('Happy path', () => {
            it(`responds 201, serialized user, storing bcrypted password`, () => {
                const randNum = Math.floor(Math.random() * 1000);
                const newUser = {
                    email: `testuser${randNum}@gmail.com`,
                    password: 'Password1!',
                    date_created: dayjs().utc().format()
                };

                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id');
                        expect(res.body.email).to.eql(newUser.email);
                        expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);
                    })
                    .expect(res =>
                        db
                            .from('users')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.email).to.eql(newUser.email);
                                return bcrypt.compare(newUser.password, row.password);
                            })
                            .then(compareMatch => {
                                expect(compareMatch).to.be.true;
                            })
                    );
            });
            it(`responds with a UTC date for date_created`, () => {
                const randNum = Math.floor(Math.random() * 1000);
                const newUser = {
                    email: `testuser${randNum}@gmail.com`,
                    password: 'Password1!',
                    date_created: dayjs().utc().format()
                };
                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        const expectedDate = dayjs().utc().format();
                        const actualDate = dayjs(res.body.date_created).utc().format();
                        expect(actualDate).to.eql(expectedDate);
                    })
            })
        });
    });
});