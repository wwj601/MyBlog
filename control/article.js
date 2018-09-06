const { db } = require('../Schema/config')
const ArticleSchema = require('../Schema/article')

// 去用户的 Schema，为了拿到操作 users 集合的实例对象
const UserSchema = require('../Schema/user')
const User = db.model("users", UserSchema)


// 通过 db 对象创建操作article数据库的模型对象
const Article = db.model("articles", ArticleSchema)

// 取评论的Schema 创建评论数据库
const CommentSchema = require('../Schema/comment')
const Comment = db.model('comments',CommentSchema)

exports.addPage = async ctx =>{
  await ctx.render('add-article',{
    title:'文章发表页',
    session:ctx.session
  })
}

exports.add = async ctx =>{
  if(ctx.session.isNew){
    // true就没登录 不需要查询数据库
    return ctx.body = {
      msg:'用户未登录',
      status:0
    }
  }

  // 用户登录状态
  // 这是在用户登录的情况下，post发过来的数据
  let data = ctx.request.body
  // 添加文章的作者
  data.author = ctx.session.uid

  await new Promise((resolve,reject) =>{
    new Article(data).save( (err,data)=>{
      if(err) return reject(err)
      // 更新用户文章计数
      User.updateOne({_id:data.author},{$inc:{articleNum:1}},err=>{
        if(err) return console.log(err)
        console.log('文章计数更新成功')
      })
      resolve(data)
    }) 
  })
  .then(data=>{
    ctx.body = {
      msg:'发表成功',
      status:1
    }
  })
  .catch(err=>{
    ctx.body = {
      msg:'发表失败',
      status:0
    }
  })
}

// 获取文章列表
exports.getList = async ctx=>{
  // 查询每篇文章对应的头像
  // id ctx.params.id
  let page = ctx.params.id || 1
  page-- //默认从0开始

  // 拿到数据库所有文章数
  const maxNum = await Article.estimatedDocumentCount( (err,num)=> err? console.log(err):num )

  // 查询数据库 筛选条件
  let artList = await Article
      .find()
      .sort('-created')
      .skip(5*page)
      .limit(5) //拿到五条数据
      // 关联users表 拿到想要的数据
      .populate({
        path:'author',
        select:'_id username avatar'
      })
      .then(data=>data)
      .catch(err =>console.log(err))

  await ctx.render('index',{
    session:ctx.session,
    title:'个人博客首页',
    artList,
    maxNum
  })


}

// 文章详情页
exports.details = async ctx=>{
  // 获取动态路由里的id
  const _id = ctx.params.id

  // 查找文章本身的数据
  const article = await Article
    .findById(_id)
    .populate('author','username')
    .then(data => data)
    .catch(err => console.log(err))

  // 查找当前文章关联的所有评论
  const comment = await Comment
    .find({article:_id})
    .sort('-created')
    .populate('from','username avatar')
    .then(data => data)
    .catch(err => console.log(err))

  await ctx.render('article',{
    title:article.title,
    comment,
    article,
    session:ctx.session
  })
}