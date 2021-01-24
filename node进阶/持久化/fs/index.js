const fs = require("fs");

//读取数据
function get(key) {
  fs.readFile("./db.json", (err, data) => {
    const json = JSON.parse(data);
    console.log(json[key]);
  });
}

//写入数据，以json文件形式存储
function set(key, value) {
  fs.readFile("./db.json", (err, data) => {
    //如果没有读取成功认为获取到的是个空json
    const json = data ? JSON.parse(data) : {};
    json[key] = value;
    fs.writeFile("./db.json", JSON.stringify(json), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("写入成功");
      }
    });
  });
}

//定制命令行
const readline = require("readline"); //将一个流分为很多行，，遇到流的\n就停止，可以截取命令行的一行命令
const rl = readline.createInterface({
  //创建一个接口连接输入流和输出流
  //因为是终端的命令行所以连接主进程的输入输出流
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", function (input) {
  //当每一行命令行敲完触发 input是命令行的字符串形式
  const [op, key, value] = input.split(" ");
  if (op === "get") {
    get(key);
  } else if (op === "set") {
    set(key, value);
  } else if (op === "quit") {
    rl.close(); //命令行的闸门关上
  } else {
    console.log("没有这个命令");
  }
});

rl.on("close", function () {
  //将程序杀死
  console.log("程序结束");
  process.exit(0); //程序安全退出
});
