const experiment = () => {

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

module.exports = experiment;




































// const experiment = () => {

//     // linear simple version

//     // people say it takes 30 days to make a habit
//     // so idea is that 'habit strength' metric will be 
//     // 100% in 30 days if user completes habits consistently
//     const timeInterval = 7; // days
//     const timesCompleted = 2; // times per interval 
//     const freq = timesCompleted / timeInterval;
//     const len = 1000; // length for dummy array
//     let prevScore = 0;
//     const increment = 0.033 // ie reaches 1.0 in 30 days for once per day habit
//     // checkmark = user checking done for given habit
//     // checkmark weight proportional to freq
//     // ie checkmark weight for once a day habit = 1
//     // and checkmark weight for once a week habit = 7
//     // if user doesn't complete habit on a day, 
//     // checkmark weight is negative (in proportion to freq)
//     // thereby decreasing habit strength. 
//     const checkMarkWeight = increment / freq;

//     const dummyCheckMarkArr = Array(len).fill(0).map((checkMarkVal, i, arr) => {
//         // checkMarkVal = i % Math.round(1 / freq) === 0
//         //     ? checkMarkWeight
//         //     : -checkMarkWeight * freq * freq;

//         checkMarkVal = Math.random() < freq 
//             ? checkMarkWeight
//             : -checkMarkWeight * freq * freq;
//         return checkMarkVal;
//     });

//     let score = prevScore;

//     let multiplier = Math.pow(0.2,freq/4)
//     let mult
//     for (let i = 0; i < len; i++) {

//         // what's a simpler way than below 3 lines?
//         mult = score <= 0 ? 1 : multiplier
//         score += score * mult + dummyCheckMarkArr[i]


//         score = score < 0 ? 0 : score;
//         score = score > 1 ? 1 : score; 

//         console.log('day', i, 'score', score)
//     }

//     console.log('checkMarkWeight', checkMarkWeight)
//     console.log('increment', increment)
//     console.log('dummyCheckMarkArr', dummyCheckMarkArr)
//     const countOccurrences = (arr) => arr.reduce((a, v) => (v > 0 ? a + 1 : a), 0);
//     const numCompletions = countOccurrences(dummyCheckMarkArr);
//     console.log('numCompletions', numCompletions)
//     console.log('multiplier', multiplier)
// }

// module.exports = experiment;


































// const experiment = () => {


//     const timeUnit = 10 // days
//     const timesCompleted = 10  
//     const freq = timesCompleted / timeUnit
//     const len = 50
//     let prevScore = 0


//     // const scoreMultiplier = Math.pow(0.5, freq / 13).toFixed(4)
//     // const scoreMultiplier = Math.exp( -freq/8 ).toFixed(4)
//     const scoreMultiplier = Math.exp( -freq/8 ).toFixed(4)

//     const checkMarkWeight = Array(len).fill(0).map((checkMarkVal, i, arr)=> {
//         if (i % Math.round(1/freq) === 0) {
//             checkMarkVal =  timeUnit/timesCompleted * (Math.exp(1.5*freq))
//         }
//         return checkMarkVal
//     })

//     let score = prevScore * scoreMultiplier


//     for (let i = 0; i < len; i++) {
//         score = score * scoreMultiplier + checkMarkWeight[i] * (1 - scoreMultiplier)


//         console.log('mult', scoreMultiplier, 'i', i, 'score', score)
//     }

//     console.log('checkMarkWeight', checkMarkWeight)
//     console.log('scoreMultiplier', scoreMultiplier)








// }

// module.exports = experiment;






































// const experiment = () => {


//     const timeUnit = 10 // days
//     const timesCompleted = 10

//     const freq = timesCompleted / timeUnit

//     const len = 50

//     const checkMarkValArr = Array(len).fill(0).map((checkMarkVal, i, arr)=> {
//         if (i % Math.round(1/freq) === 0) {
//             checkMarkVal =  timeUnit/timesCompleted 
//         }
//         return checkMarkVal
//     })

//     // 1/10  2.5
//     // 5/10  1.1
//     // 10/10 1


//     const scoreMultiplier = Math.pow(0.19, freq / 13).toFixed(4)

//     let prevScore = 0
//     let score = prevScore * scoreMultiplier


//     for (let i = 0; i < len; i++) {
//         score = score * scoreMultiplier
//         score += checkMarkValArr[i] * (1 - scoreMultiplier)
//         console.log('mult', scoreMultiplier, 'i', i, 'score', score)
//     }

//     console.log('checkMarkValArr', checkMarkValArr)








// }

// module.exports = experiment;