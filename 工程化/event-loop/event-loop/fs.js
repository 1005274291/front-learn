const fs = require('fs');

setImmediate(() => {
  console.log('setImmediate');
});

fs.readdir(__dirname, () => {
  console.log('fs.readdir');
});

setTimeout(()=>{
  console.log('setTimeout');
});

Promise.resolve().then(() => {
  console.log('promise');
});

