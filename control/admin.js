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

const fs = require('fs')
const { join } = require('path')

exports.index = async ctx =>{
  // 判断用户有没有登录
  if(ctx.session.isNew){
    ctx.status = 404
    await ctx.render('404',{
      title:404
    })
  }

  const id = ctx.params.id
  // 把所有admin文件夹下的文件放在一个数组里
  let arr = fs.readdirSync(join(__dirname,'../views/admin'))
  let flag = false

  arr.forEach(v =>{
    const name = v.replace(/^(admin\-)|(\.pug)$/g,'')
    if(name === id){
      flag = true
    }
  })

  if(flag){

    await ctx.render('./admin/admin-'+ id,{
      role:ctx.session.role
    })
  }else{
    ctx.status = 404
    await ctx.render('404',{
      title:'404'
    })
  }
}

// 获取管理用户信息
exports.account = async ctx =>{
  const uid = ctx.session.uid

  // 查找所有用户
  const data = await User.find()

  ctx.body = {
    code:0,
    data,
    count:data.length
  }
}

// 删除用户 及以下的所有评论和文章
exports.del = async ctx =>{
  const userId = ctx.params.id
  
  // 删除这个用户
  await User.deleteOne({_id:userId})
  // 删除这个用户所有的文章
  await Article.deleteMany({author:userId})
  // 删除这个用户所有的评论
  await Comment.deleteMany({from:userId})

  ctx.body = {
    state:1,
    message:'删除成功'
  }
}