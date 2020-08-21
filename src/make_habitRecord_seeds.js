const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);


const endDate = dayjs().utc().startOf('day').format();

const seedArr = [];
let curr = endDate;
let randIncrement;
const len = 300
for (let i = 0; i < len; i++) {


    curr = dayjs(curr)
        .subtract(1, 'days')
        .startOf('day')
        .utc()
        .format();
    seedArr.push([i + 2000, curr, 1])
}

console.dir(seedArr, {'maxArrayLength': null});
function randn_bm(min, max, skew) {
    var u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
    return num;
}


