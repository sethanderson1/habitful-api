const app = require('./app');
const knex = require('knex');
const { PORT, DATABASE_URL } = require('./config');
const experiment = require('./habitStrength/habitStrength')

experiment()

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
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
  console.log(`Server listening at http://localhost:${PORT}`)
})
