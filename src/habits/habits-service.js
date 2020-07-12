const xss = require('xss');

const HabitsService = {
    getAllHabits(knex, user_id) {
        return knex.select('*')
            .from('habits')
            .where({ user_id });
    },

    insertHabit(knex, newHabit) {
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

    serializeHabit(habit) {
        return {
            id: habit.id,
            name: xss(habit.name),
            description: xss(habit.description),
            num_times: habit.num_times,
            time_unit: xss(habit.time_unit)
        };
    }
};

module.exports = HabitsService