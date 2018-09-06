const { Schema } = require('./config')

const ObjectId = Schema.Types.ObjectId

const ArticleSchema = new Schema({
  title:String,
  content:String,
  author:{
    type:ObjectId,
    ref:'users'
  },//关联users 的表
  tips:String,
  commentNum:Number //评论数
},{versionKey:false,timestamps:{
  createdAt:'created'
}})

module.exports = ArticleSchema