const knex = require('knex');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Categories Endpoints', () => {

    const testUsers = helpers.makeUsersArray();
    const testCategories = helpers.makeCategoriesArray();

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
           categories,
           users
        RESTART IDENTITY CASCADE`
    ));

    afterEach('cleanup', () => db.raw(
        `TRUNCATE
            categories,
            users
            RESTART IDENTITY CASCADE`
    ));

    beforeEach('insert users', () => helpers.seedUsers(db, testUsers));
    beforeEach('insert categories', () => helpers.seedCategories(db, testCategories));

    // before: simulate login and getting jwt token and 
    // sending token to auth router and then after all that, 
    // user can add category

    describe('POST /api/categories', () => {

        const newCategory = {
            category_name: 'category1',
            author_id: testUsers[0].id
        }

        it(`Responds with 'Missing 'category_name' in request body' if not supplied`, () => {
            delete newCategory.category_name


            return supertest(app)
                .post('/api/categories')
                .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                .send(newCategory)
                .expect(400, {
                    error: { message: `Missing 'category_name' in request body` }
                })
        })


        context('Happy path', () => {
            it(`responds 201, storing category`, () => {

                const newCategory = {
                    category_name: 'category1',
                    author_id: testUsers[0].id
                }
                return supertest(app)
                    .post('/api/categories')
                    .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                    .send(newCategory)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id');
                        expect(res.body.category_name).to.eql(newCategory.category_name);
                        expect(res.headers.location).to.eql(`/api/categories/${res.body.id}`);
                    });
            })
        });
    });
});