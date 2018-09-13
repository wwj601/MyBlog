// 连接数据库 导出Schema
var mongoose = require('mongoose')

var db = mongoose.createConnection('mongodb://123.207.211.211:27017/blogproject',{useNewUrlParser:true})

// 用原生es6 Promise 代替mongoose 自实现的 Promise
mongoose.Promise = global.Promise

// 把mongoose的 Schema取出来
const Schema = mongoose.Schema

db.on('error',()=>{

  console.log('连接到数据库失败')
})

db.on('open',()=>{
  
  console.log('blogproject 连接数据库成功')
})


module.exports = {
  db,
  Schema
}