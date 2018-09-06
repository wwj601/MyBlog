const { Schema } = require('./config')
const ObjectId = Schema.Types.ObjectId

const CommemntSchema = new Schema({
  // 头像 用户名
  // 文章 内容
  content:String,
  // 关联用户表users
  from:{
    type:ObjectId,
    ref:'users'
  },
  // 关联文章article表
  article:{
    type:ObjectId,
    ref:'articles'
  }
},{versionKey:false,timestamps:{
  createdAt:'created'
}})

module.exports = CommemntSchema