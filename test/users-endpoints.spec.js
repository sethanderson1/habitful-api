const knex = require('knex');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const supertest = require('supertest');
dayjs.extend(utc)

describe('Users Endpoints', () => {

    const testUsers = helpers.makeUsersArray()

    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        // todo: make sure timezone is UTC
        app.set('db', db)
    })

    // after('disconnect from db', () => db.destroy())

    before('cleanup', () => db.raw(
        `TRUNCATE
            users
            RESTART IDENTITY CASCADE`
    ))


    // afterEach('cleanup', () => db.raw(
    //     `TRUNCATE
    //         users
    //         RESTART IDENTITY CASCADE`
    // ))

    beforeEach('insert users', () => helpers.seedUsers(db, testUsers));

    describe('POST /api/users', () => {
        ['name', 'email', 'password'].forEach(field => {
            const newUser = {
                name: 'testName1',
                email: 'testUser1@gmail.com',
                password: 'Password1!',
            };

            it(`Responds with '400 missing ${field}' if not supplied`, () => {
                delete newUser[field]

                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    // todo: do i need set here?
                    .expect(400, {
                        error: { message: `Missing '${field}' in request body` }
                    })
            });
        });

        it(`responds with 400 error when email already exists`, () => {
            const newUser = {
                name: testUsers[0].name,
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

        it(`responds with correct UTC time for date_created`, () => {

        })


        context('Happy path', () => {
            it(`responds 201, serialized user, storing bcrypted password`, () => {
                const newUser = {
                    name: 'testName1',
                    email: 'testuser1@gmail.com',
                    password: 'Password1!',
                };

                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id');
                        expect(res.body).to.not.have.property('password');
                        expect(res.body.email).to.eql(newUser.email);
                        expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);

                        // const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' });
                        // const actualDate = new Date(res.body.date_created).toLocaleString('en', { timeZone: 'UTC' });
                        // expect(actualDate).to.eql(expectedDate);
                    })
                // .expect(res =>
                //     db
                //         .from('users')
                //         .select('*')
                //         .where({ id: res.body.id })
                //         .first()
                //         .then(row => {
                //             expect(row.email).to.eql(newUser.email);
                //             const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' });
                //             const actualDate = new Date(row.date_created).toLocaleString('en', { timeZone: 'UTC' });
                //             expect(actualDate).to.eql(expectedDate);
                //             return bcrypt.compare(newUser.password, row.password);
                //         })
                //         .then(compareMatch => {
                //             expect(compareMatch).to.be.true;
                //         })
                // );
            });
            it.only(`responds with a UTC date for date_created`, () => {
                const randNum = Math.floor(Math.random() * 1000);
                console.log('randNum', randNum)
                const newUser = {
                    name: 'testName1',
                    email: `testuser${randNum}@gmail.com`,
                    password: 'Password1!',
                };
                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        // expect date in db to be in UTC
                        const dateUTC = dayjs().utc().format();

                        const expectedDate = dateUTC;
                        const actualDate = res.body.date_created;

                        // todo: when look in dbeaver, date_created is UTC
                        // but res.body.date_created is UTC + 7. It's not 
                        // even wrong in the expected direction! My time is 
                        // UTC - 7 !!! so we have to figure out


                        // expect(actualDate).to.eql(expectedDate);
                        
                        console.log('dateUTC', dateUTC)
                        console.log('date from db', actualDate)

                    })
            })
        });
    });
});