const xss = require('xss');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

const HabitRecordsService = {
    async getAllHabitRecordsByUser(knex, user_id) {

        const returnedHabitRecords = await knex
        .select('habit_id','habit_records.id','date_completed')
        .from('habit_records')
        //and join with habits in order to get habit name, etc.
        .innerJoin('habits', `habit_records.habit_id`, `habits.id`)
        // filter by record date. and by interval es^pecially
        // .where('habit_records.date_completed', '2020-07-12 22:52:05')
        // .select(['habits.name', 'habit_records.date_completed'])
        .where({ user_id });

        
        console.log('returnedHabitRecords', returnedHabitRecords)
        return returnedHabitRecords
    },

    // getAllHabitRecordsByHabitId(knex, habit_id) {
    //     console.log()
    //     return knex.select('*')
    //         .from('habit_records')
    //         .where({ habit_id });
    // },

    insertHabitRecord(knex, newHabitRecord) {
        // converts habit record to UTC
        newHabitRecord.date_completed = dayjs(
            newHabitRecord.date_completed
        )
            .utc()
            .format()
        const recordReturned = knex
            .insert(newHabitRecord)
            .into('habit_records')
            .returning('*')
            .then(rows => {
                return rows[0]
            });
        return recordReturned
    },

    getHabitRecordsByHabitId(knex, habit_id) {
        return knex
            .select('*')
            .from('habit_records')
            .where({habit_id})
    },

    getById(knex, id) {
        return knex
            .select('*')
            .from('habit_records')
            .where('id', id)
            .first();
    },


    deleteHabitRecord(knex, id) {
        return knex('habit_records')
            .where({id})
            .delete();
    },

    updateHabitRecord(knex, id, newHabitRecordField) {
        return knex('habit_records')
            .where({ id })
            .update(newHabitRecordField);
    },

    serializeHabitRecord(habit_records) {
        // WITH UTC CONVERSION
        const date_completed_sanitized = xss(habit_records.date_completed);
        // xss converts date from UTC to local, so use dayjs to 
        // convert back to UTC
        const date_completed = dayjs(
            date_completed_sanitized
        )
            .utc()
            .format();
        // console.log('after dayjs', date_completed)

        return {
            id: habit_records.id,
            date_completed,
            habit_id: habit_records.habit_id
        };


        // // WITHOUT UTC CONVERSION
        // return {
        //     id: habit_records.id,
        //     date_completed:  xss(habit_records.date_completed),
        //     habit_id: habit_records.habit_id
        // };
    }
};

module.exports = HabitRecordsService