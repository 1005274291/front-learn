setTimeout(()=>{ // 定时器
  console.log('1 setTimeout1');
  Promise.resolve().then(() => console.log('2 promise1'));
});

setImmediate(() => { // 立执行
  console.log('3 setImmediate1');
  Promise.resolve().then(() => console.log('4 promise3'));
});

setTimeout(()=>{ // 定时器
  console.log('5 setTimeout2');
  Promise.resolve().then(() => console.log('6 promise2'));
});

setImmediate(() => { // 立执行
  console.log('7 setImmediate2');
  Promise.resolve().then(() => console.log('8 promise4'));
});

