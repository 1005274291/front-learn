var express=require("express")
var app=express()
var server=require("http").createServer(app)
var io=require("socket.io").listen(server)
var fs=require("fs")
app.use("/socket.io.js",express.static("./node_modules/socket.io-client/dist/socket.io.js"))
app.get("/",function(req,res){
    fs.readFile("./index.html",{encoding:"utf-8"},function(err,data){
        res.send(data)
    })
})




io.on("connection",function(socket){
    socket.emit("welcome","你好")//向用户自己发送消息
    socket.on("userjoin",function(data){
        io.sockets.emit("newmsg",data+"加入")//向所有人发送消息
    })
    socket.on("sendnewmsg",function(data){
        io.sockets.emit("newmsg",data)
    })
    // io.sockets.emit("someoneconnect")
})
server.listen(3000)