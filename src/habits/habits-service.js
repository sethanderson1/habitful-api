const xss = require('xss');

const HabitsService = {
    getAllHabits(knex, user_id) {
        console.log('user_id', user_id)
        return knex
            .select('*')
            .from('habits')
            .where({ user_id })
            .orderBy('id','asc');
    },

    insertHabit(knex, newHabit) {
        console.log('insertHabit ran')
        return knex
            .insert(newHabit)
            .into('habits')
            .returning('*')
            .then(rows => {
                return rows[0]
            });
    },

    getById(knex, id) {
        return knex
            .select('*')
            .from('habits')
            .where('id', id)
            .first();
    },

    deleteHabit(knex, id) {
        return knex('habits')
            .where('id', id)
            .delete();
    },

    updateHabit(knex, id, newHabitFields) {
        return knex('habits')
            .where({ id })
            .update(newHabitFields);
    },

    // todo: might add date_created here
    serializeHabit(habit) {
        return {
            id: habit.id,
            name: xss(habit.name),
            description: xss(habit.description),
            num_times: xss(habit.num_times),
            time_interval: xss(habit.time_interval),
            date_created: habit.date_created
        };
    }
};

module.exports = HabitsService