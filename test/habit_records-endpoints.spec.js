const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const HabitRecordsService = require('../src/habit_records/habit_records-service');
const dayjs = require('dayjs');
const { expect } = require('chai');

describe('HabitRecords Endpoints', () => {

    const testUsers = helpers.makeUsersArray();
    const testHabits = helpers.makeHabitsArray();
    const testHabitRecords = helpers.makeHabitRecordsArray();
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
           habit_records,
           habits,
           users
        RESTART IDENTITY CASCADE`
    ));

    afterEach('cleanup', () => db.raw(
        `TRUNCATE
           habit_records,
           habits,
           users
        RESTART IDENTITY CASCADE`
    ));

    beforeEach('insert users', () => helpers.seedUsers(db, testUsers));
    beforeEach('insert habits', () => helpers.seedHabits(db, testHabits));
    beforeEach('insert habit_records', () => helpers.seedHabitRecords(db, testHabitRecords));

    describe('POST /api/habit-records', () => {

        context('Happy path', () => {

            it(`responds 201, storing habit record`, () => {
                const newHabitRecord = {
                    date_completed: '2020-08-08T07:00:00Z',
                    habit_id: 1
                }
                return supertest(app)
                    .post('/api/habit-records')
                    .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                    .send(newHabitRecord)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.date_completed).to.eql(newHabitRecord.date_completed)
                    });
            });
        });
    });

    describe('GET /api/habit-records', () => {

        context('Happy path', () => {

            const expectedHabitRecords = testHabitRecords.map(habit_record => {
                return HabitRecordsService.serializeHabitRecord(habit_record)
            })
            it(`responds 200, getting all habit_records from given user`, () => {
                return supertest(app)
                    .get(`/api/habit-records`)
                    .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                    .expect(200)
                    .expect(res => {
                        expect(expectedHabitRecords.habit_id)
                            .to.eql(res.body.habit_id)
                        expect(expectedHabitRecords.id)
                            .to.eql(res.body.id)
                        expect(expectedHabitRecords.date_completed)
                            .to.eql(res.body.date_completed)
                    })
            });
        });
    });

    describe('GET /api/habit-records/1', () => {

        context('Happy path', () => {

            console.log('testHabitRecords[0]', testHabitRecords[0])
            const expectedHabitRecord = HabitRecordsService.serializeHabitRecord(testHabitRecords[0])
            // const expectedHabitRecord = testHabitRecords[0]
            console.log('expectedHabitRecord', expectedHabitRecord)
            console.log('testHabitRecords[0]', testHabitRecords[0])
            it(`responds 200, returning single habit_record`, () => {
                return supertest(app)
                    .get(`/api/habit-records/record/${testHabitRecords[0].id}`)
                    .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                    .expect(200)
            });
        })
    });


    describe('DELETE /api/habit-records/1', () => {

        context('Happy path', () => {

            it(`responds 204`, () => {
                return supertest(app)
                    .delete(`/api/habit-records/record/${testHabitRecords[0].id}`)
                    .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                    .expect(204);
            });
        });
    });
});


