
setTimeout(() => {
  console.log('1 setTimeout1')
})

Promise.resolve().then(() => {
  console.log('2 promise1')
  Promise.resolve().then(() => {
    console.log('3 promise1')
  });
  return;
});

console.log('4 script end');


