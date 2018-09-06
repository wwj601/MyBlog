const { db } = require('../Schema/config')

const ArticleSchema = require('../Schema/article')
// 通过 db 对象创建操作article数据库的模型对象
const Article = db.model("articles", ArticleSchema)


// 去用户的 Schema，为了拿到操作 users 集合的实例对象
const UserSchema = require('../Schema/user')
const User = db.model("users", UserSchema)

// 取评论的Schema 创建评论数据库
const CommentSchema = require('../Schema/comment')
const Comment = db.model('comments',CommentSchema)

// 发表评论
exports.save = async ctx =>{
  let message = {
    msg:'登录后才能评论',
    status:0
  }
  // 判断是否登录
  if(ctx.session.isNew) return ctx.body = message

  // 用户登陆后，拿到data
  let data = ctx.request.body
  data.from = ctx.session.uid

  // 评论存到数据库
  const _comment = new Comment(data)

  await _comment
    .save()
    .then(data =>{
      message = {
        msg:'发表成功',
        status:1
      }

      // 更新当前文章的评论计数器
      Article
        .update({_id:data.article},{$inc:{commentNum:1}}, err=>{
          if(err) return console.log(err)
          console.log('评论计数器更新成功')
        })

      // 更新用户的评论计数器
      User
        .update({_id:data.from},{$inc:{commentNum:1}},err =>{
          if(err) return console.log(err)
        })

    })
    .catch(err=>{
      message = {
        status:0,
        msg:err
      }
    })

  ctx.body = message
  
}