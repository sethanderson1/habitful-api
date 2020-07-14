const habitStrength = () => {

    // it's said that it takes 30 days to make a habit
    // so the idea is that 'habit strength' metric will be 
    // 100% in 30 days if user completes habits at the 
    // goal frequency
    const timeInterval = 7; // days
    const timesCompleted = 7; // times per interval 
    const freq = timesCompleted / timeInterval;
    const numDays = 500; // length for dummy array (for testing)
    let prevHabitStrength = 0;
    const checkMarkWeight = 1 / freq; 

    const dummyCheckMarkArr = Array(numDays).fill(0).map((checkMarkVal, i, arr) => {

        const userCompletionRate = 1; // 1 = 100%
        checkMarkVal = Math.random() < freq * userCompletionRate
            ? checkMarkWeight
            : 0;
        return checkMarkVal;
    });

    let habitStrength = prevHabitStrength;
    let multiplier = Math.pow(0.5, freq / 13); // 

    for (let i = 0; i < numDays; i++) {

        // habitStrength formula
        habitStrength = habitStrength * multiplier + dummyCheckMarkArr[i] * (1 - multiplier)

        habitStrength = habitStrength < 0 ? 0 : habitStrength;
        habitStrength = habitStrength > 1 ? 1 : habitStrength;

        console.log('day', i, 'habitStrength', habitStrength)
    }

    console.log('dummyCheckMarkArr', dummyCheckMarkArr)
    const countOccurrences = (arr) => arr.reduce((a, v) => (v > 0 ? a + 1 : a), 0);
    const numCompletions = countOccurrences(dummyCheckMarkArr);
    console.log('checkMarkWeight', checkMarkWeight)
    console.log('multiplier', multiplier)
    console.log('numCompletions', numCompletions, '/', numDays)
}

module.exports = habitStrength;