console.log('1 script start');

setTimeout(function() {
  console.log('2 setTimeout');
  Promise.resolve().then(function() {
    console.log('3 promise1');
  });
}, 0);

Promise.resolve().then(function() {
  console.log('4 promise1');
}).then(function() {
  console.log('5 promise2');
});

console.log('6 script end');
