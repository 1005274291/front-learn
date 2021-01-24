//由于数据库和node.js是分布在两台机器上的，所以他们通信使用的是tcp协议，需要进行三次握手+执行sql语句+四次挥手
//如果并发量过高，而很多用户同时进行数据库操作，非常的浪费时间，无法实现限制连接数，还需要等待建立连接完成后才能进行操作
//如果采用连接池技术，将连接建立后存储在池子中，执行sql语句后放回池子而不断开连接，这样就限制了连接数

const mysql = require("mysql2/promise");
const cfg = {
  host: "localhost",
  user: "root",
  password: "123456",
  database: "shop",
  connectionLimit: 5, //使用连接池时，最大并发数等于连接数，不适用连接池时最大并发数等于实际的并发数
};

// 非连接池 总耗时3190.859ms
// const query = async () => {
//   const connection = await mysql.createConnection(cfg);//建立连接
//   const [rows, fields] = await connection.execute(`SELECT * FROM users`);
//   // console.log('select:', rows)
//   connection.destroy();//关闭连接
// };

const { asyncFun } = require("./async");

(async () => {//总耗时: 948.110ms
  // 设置连接池
  const pool = await mysql.createPool(cfg);
  // 连接池
  const query = async () => {
    const connection = await pool.getConnection(); //从连接池中拿一个连接
    const [rows, fields] = await connection.execute(`SELECT * FROM users`);
    // console.log('select:', rows)
    connection.release();
  };
  asyncFun(query, 20, 1000);
})();


