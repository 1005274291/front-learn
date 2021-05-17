//定义user表的字段类型

module.exports=app=>{
    const mongoose=app.mongoose
    const Schema=mongoose.Schema
    //建立表的模型
    const UserSchema= new Schema({
        __v:{type:Number,select:false},
        email:{type:String,require:true},
        passwd:{type:String,require:true,select:false},
        nickname:{type:String,require:true},
        avatar:{type:String,require:false,default:"/user.png"}
    },{
        timestamps:true//创建时间和更新时间
    })
    return mongoose.model('User',UserSchema)
}