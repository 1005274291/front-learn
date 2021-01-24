//tcp编程又称为套接字编程
//工作中，我们经常需要使用telnet命令登录某一个服务器或者查看本机和服务器是否正常连接。 其实就是通过tcp发送字节流

//curl 建立的是http协议
const net =require("net")

const chatServer =net.createServer()  //创建服务器

const clientList=[] //存储一组客户端
chatServer.on("connection",client=>{
    //当有客户端连接上服务器时触发事件
    //client实际上是个字节流 管道的一端是客户端,一端是服务器
    client.write("welcome!")
    clientList.push(client) //将客户端存储起来
    client.on("data",(date)=>{
        //当客户端管道往外输出数据的时候触发打他事件，，date是二进制数据
        console.log('receive:',date.toString())
        clientList.forEach(v=>{
            v.write(date)//广播
        })
    })
})
chatServer.listen(9000)

//socket.io是websocket的实现，，是建立连接通过http，之后的通信使用socket 实现了优雅降级