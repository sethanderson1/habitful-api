const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Habits Endpoints', () => {

    const testUsers = helpers.makeUsersArray();
    const testHabits = helpers.makeHabitsArray();

    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    });

    after('disconnect from db', () => db.destroy());

    before('cleanup', () => db.raw(
        `TRUNCATE
           habits,
           users
        RESTART IDENTITY CASCADE`
    ));

    afterEach('cleanup', () => db.raw(
        `TRUNCATE
            habits,
            users
            RESTART IDENTITY CASCADE`
    ));

    beforeEach('insert users', () => helpers.seedUsers(db, testUsers));
    beforeEach('insert habits', () => helpers.seedHabits(db, testHabits));

    describe('POST /api/habits', () => {

        const newHabit = {
            name: 'habit name',
            description: 'habit description',
            num_times: 7,
            time_interval: 'week',
            date_created: '2020-07-01T19:28:32.615',
            user_id: testUsers[0].id,
        }

        it(`Responds with 'Missing 'name' in request body' if not supplied`, () => {
            delete newHabit.name

            return supertest(app)
                .post('/api/habits')
                .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                .send(newHabit)
                .expect(400, {
                    error: { message: `Missing 'name' in request body` }
                })
        })


        context('Happy path', () => {
            it(`responds 201, storing habit`, () => {

                const newHabit = {
                    name: 'habit name',
                    description: 'habit description',
                    num_times: 7,
                    time_interval: 'week',
                    date_created: '2020-07-01T19:28:32.615',
                    user_id: testUsers[0].id,
                }
                return supertest(app)
                    .post('/api/habits')
                    .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                    .send(newHabit)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id');
                        expect(res.body.name).to.eql(newHabit.name);
                        expect(res.headers.location).to.eql(`/api/habits/${res.body.id}`);
                    });
            })
        });
    });
});