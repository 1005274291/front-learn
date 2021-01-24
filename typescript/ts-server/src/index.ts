import * as Koa from "koa"
import * as bodify from "koa-body"
import * as serve from "koa-static"
import {load} from "./utils/route-decors"
import {resolve} from "path"
import { Sequelize } from 'sequelize-typescript';

const app=new Koa()
const router=load(resolve(__dirname,"./routes"),{})

const database = new Sequelize({
    port:3306,
    database:'kaikeba',
    username:'root',
    password:'123456',
    dialect:'mysql',
    modelPaths: [`${__dirname}/model`],//自动扫描文件夹下的文件创建表并生成模型

});

database.sync({force: false})

app.use(router.routes())
app.use(serve(`${__dirname}/public`))

app.use(
    bodify({
        multipart:true,
        //使用非严格模式，解析delete请求的请求体
        strict:false
    })
)

app.use((ctx:Koa.Context)=>{
    ctx.body="hello"
})


app.listen(3000,()=>{
    console.log("服务器启动成功")
})