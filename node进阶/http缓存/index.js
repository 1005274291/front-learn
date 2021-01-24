
function updateTime(){
    this.timmer= this.timmer|| setInterval(()=>{
        this.time=new Date().toUTCString()
    },3000)
    return this.time
}

const http=require("http")
http.createServer((req,res)=>{
    const {url}=req
    if("/"===url){
        //一进首页先返回一个html
        res.end(`
        <html>
            Html Update Time ${updateTime()}
            <script src='main.js'></script>
        </html>
        `)
    }else if(url==="/main.js"){
        const content =`document.writeln('<br>Js Update Time:${updateTime()}')`
        //强制缓存，不会请求服务端直接拿取副本
        res.setHeader("Expires",new Date(Date.now()+10*1000).toUTCString())//http1.0采用的是绝对时间，但是由于时间是服务器发送给浏览器的，，而客户端的时间和服务器的时间不统一所以有一定的局限性
        res.setHeader("Cache-Control","max-age=20")//http1.1采用的，优先级高于expires 相对时间，单位是s
        //协商缓存 客户端带着协商缓存的请求头，去请求服务器，如果有代理服务器就会将其拦截，不会走到后面的服务器当中，如果命中协商缓存会返回304，如果没有命中会返回200和需要返回的正文
        //客户端第一次请求服务器静态资源的时候，服务器会返回一个last-modified请求头带着上次修改的时间，以后再次请求这个文件客户端会带着if-modified-since这个请求头和同样的时间，让服务器去判断是否命中协商缓存
        res.setHeader("Cache-Control","no-cache")//关闭强制缓存，采用协商缓存
        //no-catch 是禁止强缓去服务器申请协商缓存 no-store是真正意义的不缓存
        
        // res.setHeader('last-modified',new Date().toUTCString())  
        // if(new Date(req.headers["if-modified-since"]).getTime()+3*1000>new Date().getTime()){
        //     //如果这次请求的资源距离上次修改的时间不到3秒，认为协商命中
        //     res.statusCode=304
        //     res.end()
        //     return
        // }

        // 采用etag和if-None-Match,将静态资源文件的哈希值etag发送过去，，每次请求静态资源时会将if-none-match发送到服务器，服务器会重新计算静态资源的hash值，如果比较通过就304，不通过返回新的静态资源文件
        const crypto=require("crypto")
        const hash=crypto.createHash("sha1").update(content).digest("hex")//hash完的是二进制，需要把二进制转化为字符串的形式
        res.setHeader('Etag',hash)
        if(req.headers["if-none-match"]===hash){
            console.log("命中etag缓存")
            res.statusCode=304
            res.end()
            return
        }
        res.statusCode=200
        res.end(content)
    }else if(url ==="/favicon.ico"){
        res.end("")
    }
}).listen(3000,()=>{
    console.log("3000 start")
})