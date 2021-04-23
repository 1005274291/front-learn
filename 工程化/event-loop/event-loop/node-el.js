
setTimeout(()=>{
  console.log('1 timer1');
  Promise.resolve().then(function() {
      console.log('2 promise1');
  });
});

setTimeout(()=>{
  console.log('3 timer2');
  Promise.resolve().then(function() {
      console.log('4 promise2');
  });
});


