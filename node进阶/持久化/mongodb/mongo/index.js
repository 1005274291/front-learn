const express = require("express")
const app = express()
const path = require("path")
const mongo = require("./models/db")
// const testdata = require("./initData")

app.get("/", (req, res) => {
    res.sendFile(path.resolve("./index.html"))
})

app.get("/api/list", async (req, res) => {
    // 分页查询
    const { page,category,keyword} = req.query
    const condition={}//查询条件
    try {
        if(category){
            //如果传种类筛选了就带上筛选条件去查库
            condition.category=category
        }
        if(keyword){
            //对命名进行筛选
            condition.name={
                $regex:new RegExp(keyword)//含有模糊匹配的参数即可
            }
        }
        const col = mongo.col("fruits")
        const total = await col.find(condition).count()//选出表中的所有记录总数
        const fruits = await col
            .find(condition)
            .skip((page - 1) * 5)//跳过多少条记录
            .limit(5)//限制在多少条记录
            .toArray()
        res.json({ ok: 1, data: { fruits, pagination: { total, page } } })
    } catch (error) {
        console.log(error)
    }
})

app.get("/api/category", async (req, res) => {
    const col = mongo.col("fruits")
    const data = await col.distinct('category')//选出category列属性的值并去重
    res.json({ ok: 1, data })
})

app.listen(3000)