const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

//设置一个异步函数，设置并发量，和操作总数
const asyncFun = async (fun, curMax = 4, sum = 200) => {
    let num = 0
    let curNum = 0
    console.time('总耗时');
    console.log('beginTime:' + new Date().toLocaleString())
    const result = []
    while (num !== sum) {
        if (curNum <= curMax) {
            result.push(new Promise(async resolve => {
                console.log(`Process Run 并发数:${curNum} 完成:${num}/${sum} `)
                res = await fun()
                curNum--
                resolve(res)
            }))
            num++
            curNum++
        } else {
            await sleep(10)
        }
    }
    console.log('endTime:' + new Date().toLocaleString())
    console.timeEnd('总耗时');
}

module.exports = { asyncFun };

// // 测试
// const test = async () => {
//   const delay = (Math.random() * 1000).toFixed();
//   await sleep(delay);
// };
// setTimeout(() => asyncFun(test, 4, 20));

//mysqladmin -uroot -p123456 processlist  //查看mysql的连接数
