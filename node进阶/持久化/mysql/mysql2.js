(async () => {
  const mysql = require("mysql2/promise"); //promise风格的mysql
  const cfg = {
    //配置项
    host: "localhost",
    user: "root",
    password: "123456",
    database: "开课吧",
  };

  const connection = await mysql.createConnection(cfg); //建立连接
  //创建表 execute是执行sql语句
  let ret = await connection.execute(`
  CREATE TABLE IF NOT EXISTS test ( id INT NOT NULL AUTO_INCREMENT, message VARCHAR(45) NULL, PRIMARY KEY (id))
  `);
  //插入表中数据，为了防止注入，使用占位符
//   ret=await connection.execute(`INSERT INTO test(message) VALUES(?)`,["a"])//?是后面数组的占位符，向test表中的message插入数据
  console.log(ret)//affectedRows 受影响的行数 insertId主键的值

  const [rows,fields]=await connection.execute(`SELECT * FROM test`)
  console.log('select',rows,fields)//rows是结果集 fields是表头
})();
