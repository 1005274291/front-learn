const http = require("http");
const fs = require("fs");

//跨域只发生在xhr的浏览器的同源限制策略（协议，域名，端口）
//跨域时即使浏览器回应了请求也会给你控制住
//跨域默认是不传递cookie的
http
  .createServer((req, res) => {
    const { method, url ,headers} = req;//options不携带cookie
    console.log(method, url,headers.cookie);
    if (method === "GET" && url == "/") {
      fs.readFile("./index.html", (err, data) => {
        res.setHeader("Content-Type", "text/html");
        res.end(data);
      });
    } else if (method === "GET" && url == "/api/users") {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Credentials",true)//允许客户端携带验证信息
    //   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); //告诉浏览器允许3000端口的客户端进行访问
      res.setHeader("Set-Cookie","cookie1=123")//设置cookie到请求头，，浏览器会根据Set-Cookie这个关键字去设置cookie
      res.end(JSON.stringify({ name: "jun" }));
    } else if (method == "OPTIONS" && url == "/api/users") {
      //options是预检请求，，如果浏览器觉得客户端发送的请求危险，会先发送预见请求
      //包括除了get，post请求的事件 headers里面包含非常规的东西
      res.setHeader("Access-Control-Allow-Credentials",true)//跨域允许携带cookie
      res.writeHead(200, {
        //服务器通知是否可以通过这个预检请求
        "Access-Control-Allow-Origin": "http://localhost:3000", //允许这个连接跨域
        "Access-Control-Allow-Headers": "X-Token,Content-Type", //允许headers带这些东西的
        "Access-Control-Allow-Methods": "PUT", //允许请求方式是put的 这三种满足一条就可以
      });
      res.end();
    }else if(method ==="POST" && url ==="/api/save"){
        let reqData=[]
        let size =0
        req.on("data",data=>{
            //body信息是以流的形式存在的
            reqData.push(data)//存储二进制数据
            size+=data.length//调整字节大小
        })
        req.on("end",function(){
            //流传输数据完毕的监听器
            const data=Buffer.concat(reqData,size)//将二进制合并
            res.end(`formData:${data.toString()}`)
        })
    }
  })
  .listen(4000, () => {
    console.log(`4000端口开启`);
  });
