const app = require('./app');
const knex = require('knex');
const { PORT, DATABASE_URL } = require('./config');
const experiment = require('./habitStrength/habitStrength');

// experiment()

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
  // pool: {
  //   min: 1,
  //   max: 10,

  //   afterCreate: function (conn, done) {
  //     // in this example we use pg driver's connection API
  //     conn.query('SET timezone="UTC";', function (err) {
  //       if (err) {
  //         // first query failed, return error and don't try to make next query
  //         console.log('init err:', err)
  //         done(err, conn);
  //       } else {
  //         console.log('timezone set to UTC')
  //         done(null, conn)

  //       }
  //     });

  //   }
  // }
});


// // may not need to do this timezone here
// const db = knex({
//   client: 'pg',
//   connection: {
//     host: process.env.HOST,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE,
//     timezone: 'UTC'
//   }
// });

app.set('db', db);

app.listen(PORT, () => {
  // console.log(`Server listening at http://localhost:${PORT}`)
})
