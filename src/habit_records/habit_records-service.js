const xss = require('xss');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

const HabitRecordsService = {
    async getAllHabitRecordsByUser(knex, user_id) {
        const returnedHabitRecords = await knex
            .select('habit_id', 'habit_records.id', 'date_completed')
            .from('habit_records')
            .innerJoin('habits', `habit_records.habit_id`, `habits.id`)
            .where({ user_id });
        return returnedHabitRecords
    },

    insertHabitRecord(knex, newHabitRecord) {
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
            .where({ habit_id })
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
            .where({ id })
            .delete();
    },

    serializeHabitRecord(habit_records) {
        const date_completed_sanitized = xss(habit_records.date_completed);
        const date_completed = dayjs(
            date_completed_sanitized
        )
            .utc()
            .format();

        return {
            id: habit_records.id,
            date_completed,
            habit_id: habit_records.habit_id
        };
    }
};

module.exports = HabitRecordsService