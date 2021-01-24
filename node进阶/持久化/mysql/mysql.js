var mysql=require("mysql")
var connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"123456",
    database:'schoolinfo'
})
connection.connect();

// connection.query(`               //插入
// insert into teacher
// (name,subject,job)
// values
// ("小孩","计算机","博士");
// `,function(err,result){
//     if(err){
//         return
//     }
//     console.log(result)
// })
// connection.query(`delete from teacher where id=8`,function(err,result){           //删除
//     console.log(result)
// })


// connection.query(`                                           //更新
// update teacher set job="司令" where name="宝汇"
// `,function(err,result){
//     console.log(result)
// })


connection.query("select * from teacher;",function(err,result){                 //查看
    if(err){
        return
    }
    console.log(result)
})





connection.end()