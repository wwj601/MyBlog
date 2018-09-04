const { db } = require('../Schema/config')
const ArticleSchema = require('../Schema/article')

// 去用户的 Schema，为了拿到操作 users 集合的实例对象
const UserSchema = require('../Schema/user')
const User = db.model("users", UserSchema)


// 通过 db 对象创建操作article数据库的模型对象
const Article = db.model("articles", ArticleSchema)

exports.addPage = async ctx =>{
  await ctx.render('add-article',{
    title:'文章发表页',
    session:ctx.session
  })
}