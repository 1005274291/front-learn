module.exports={
    async init(ctx,next){
        //拿到对应的模型
        const model =ctx.app.$model[ctx.params.list]
        if(model){
            ctx.list=model//将模型挂载
            await next()//进行接下来的具体操作
        }else{
            ctx.body="no this model"
        }
    },
    async get(ctx) {
        ctx.body = await ctx.list.findOne({_id:ctx.params.id})

    },
    async create(ctx) {
        const res = await ctx.list.create(ctx.request.body)
        ctx.body = res
    },
    async update(ctx) {
        const res = await ctx.list.updateOne({ _id: ctx.params.id }, ctx.request.body)
        ctx.body = res
    },
    async del(ctx) {
        const res = await ctx.list.deleteOne({ _id: ctx.params.id })
        ctx.body = res
    },
    async list(ctx) {
        console.log('page...', ctx.params.page)
        ctx.body = await ctx.list.find({})/*  */
    },
}