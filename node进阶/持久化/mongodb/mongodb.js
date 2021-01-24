var mongodb = require("mongodb")
var mongoclient = mongodb.MongoClient
var objectid = mongodb.ObjectId
const mongodburl = "mongodb://127.0.0.1:27017"
var mongocotrol = function (dbname, tablename) {
    this.dbname = dbname
    this.tablename = tablename
    this.insert = function (data, callback) {
        mongoclient.connect(mongodburl, { useNewUrlParser: true }, (err, client) => {
            if (err) {
                callback(err)
                return
            }
            var db = client.db(this.dbname)
            db.collection(this.tablename).insert(data, function (err, res) {
                callback(err, res)
                client.close()
            })
        })
    }
    this.remove = function (findate, callback) {
        mongoclient.connect(mongodburl, { useNewUrlParser: true }, (err, client) => {
            if (err) {
                callback(err)
                return
            }
            var db = client.db(this.dbname)
            db.collection(tablename).remove(findate, (err, res) => {
                callback(err, res.result)
                client.close()
            })
        })
    }
    this.removebyid = function (_id, callback) {
        mongoclient.connect(mongodburl, { useNewUrlParser: true }, (err, client) => {
            if (err) {
                callback(err)
                return
            }
            var db = client.db(this.dbname)
            db.collection(this.tablename).remove({ _id: objectid(_id) }, function (err, res) {
                callback(err, res.result)
                client.close()
            })
        })
    }
    this.find = function (data, callback) {
        mongoclient.connect(mongodburl, { useNewUrlParser: true }, (err, client) => {
            if (err) {
                callback(err)
                return
            }
            var db = client.db(this.dbname)
            db.collection(this.tablename).find(data).toArray(function (err, res) {
                callback(err, res)
                client.close()
            })
        })
    }
    this.findbyid = function (_id, callback) {
        mongoclient.connect(mongodburl, { useNewUrlParser: true }, (err, client) => {
            if (err) {
                callback(err)
                return
            }
            var db = client.db(this.dbname)
            db.collection(this.tablename).find({ _id: objectid(_id) }).toArray(function (err, res) {
                callback(err, res)
                client.close()
            })
        })
    }
    this.update = function (findate, newdate, callback) {
        mongoclient.connect(mongodburl, { useNewUrlParser: true }, (err, client) => {
            if (err) {
                callback(err)
                return
            }
            var db = client.db(this.dbname)
            db.collection(this.tablename).updateMany(findate, { $set: newdate }, function (err, res) {
                callback(err, res)
                client.close()
            })
        })
    }
    this.updatebyid = function (_id, newdate, callback) {
        mongoclient.connect(mongodburl, { useNewUrlParser: true }, (err, client) => {
            if (err) {
                callback(err)
                return
            }
            var db = client.db(this.dbname)
            db.collection(this.tablename).update({ _id: objectid(_id) }, { $set: newdate }, function (err, res) {
                callback(err, res)
                client.close()
            })
        })
    }
}
exports.mongocotrol = mongocotrol
// var user = new mongocotrol("test", "user")
// user.insert({
//     name: "徐天"
// }, function (err, res) {
//     console.log(res)
// })
// user.removebyid("5e525bc3bef80e13f0465e7b",function(err,res){
//     console.log(res.result)
// })
// user.find({ name: "军少" }, function (err, res) {
//     console.log(res)
// })
// user.update({name:"军少"},{age:18},function(err,res){
// console.log(res.result)
// })
// user.updatebyid("5e524cd58485235dc827ac3b", { age: 17 }, function (err, res) {
//     console.log(res.result)
// })
// user.findbyid("5e5254d58e912f5c242c3355",function(err,res){
//     console.log(res)
// })