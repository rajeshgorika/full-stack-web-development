// ES6 Array Methods

const numbers = [10, 20, 30, 40, 50];

// map()
const doubled = numbers.map(num => num * 2);
console.log("Doubled:", doubled);

// filter()
const greaterThan20 = numbers.filter(num => num > 20);
console.log("Greater than 20:", greaterThan20);

// reduce()
const total = numbers.reduce((sum, num) => sum + num, 0);
console.log("Total:", total);
