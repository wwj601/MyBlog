const { db } = require('../Schema/config')
const UserSchema = require('../Schema/user')
const encrypt = require('../util/encrypt')

// 通过 db 对象创建user数据库的模型对象
const User = db.model('users',UserSchema)

// 用户注册
exports.reg = async (ctx)=>{
  // 用户注册时发过来的post数据
  const user = ctx.request.body
  const username = user.username
  const password = user.password

  // 注册时 假设以下格式符合
  // 先去数据库 user表里去查询当前发过来的username是否存在
  await new Promise((resolve,reject)=>{
    User.find({username},(err,data)=>{
      if(err) return reject(err)
      // 数据库没出错 还有没有数据
      if(data.length !==0){
        // 查询到数据库 用户名已经存在
        return resolve('')
      }
      // 用户名不存在 存到数据库
      // 存到数据库之前需要先对密码加密 encrypt模块是自定义加密模块
      const _user = new User({
        username,
        password:encrypt(password)
      })

      _user.save((err,data)=>{
        if(err) {
          // 存数据库失败
          reject(err)
        }else{
           // 存数据库失败
          resolve(data)
        }
      })

    })
  })
  .then(async (data)=>{
    if(data){
      // 注册成功
      await ctx.render('isok',{
        status:'注册成功'
      })
    }else{
      // 用户名已存在
      await ctx.render('isok',{
        status:'用户名已存在'
      })
    }
  })
  .catch(async (err)=>{
    await ctx.render('isok',{
      status:'注册失败，请重试'
    })
  })
}

// 用户登录
exports.login = async (ctx) =>{

  // 拿到用户信息
  const user = ctx.request.body
  const username = user.username
  const password = user.password

  await new Promise((resolve,reject)=>{
    User.find({username},(err,data)=>{
      // 数据库查询失败
      if(err) return reject(err)
      // 查询数据库无此用户名
      if(data.length === 0) return reject('用户名不存在')

      // 把用户传过来的密码 加密后跟数据库的比对 密码正确
      if(data[0].password === encrypt(password)){
        return resolve(data)
      }
   
      // 密码错误
      resolve('')

    })
  })
  .then( async data =>{

    if(!data){
      return ctx.render('isok',{
        status:'密码不正确，登录失败'
      }) 
    }

    // 让用户在他的 cookie 里设置 username password 加密后的密码权限
    ctx.cookies.set('username',username,{
      domain:'localhost',
      path:'/',
      maxAge:36e5,
      httpOnly:true, //true 不让客户端访问这个 cookie
      overwrite:false,
      signed:false
    })
    // 用户在数据库的id值
    ctx.cookies.set('uid',data[0]._id,{
      domain:'localhost',
      path:'/',
      maxAge:36e5,
      httpOnly:true, //true 不让客户端访问这个 cookie
      overwrite:false,
      signed:false
    })

    ctx.session = {
      username,
      uid:data[0]._id,
      avatar:data[0].avatar
    }
    
    // 密码正确登录成功
    await ctx.render('isok',{
      status:'登陆成功'
    })
      
    
  })
  .catch( async err=>{

    await ctx.render('isok',{
      status:'登录失败'
    })
  })
}

// 用户退出
exports.logout = async ctx =>{
  ctx.session = null
  ctx.cookies.set('username',null,{
    maxAge:0
  })

  ctx.cookies.set('sid',null,{
    maxAge:0
  })

  // 在后台做重定向 跟
  ctx.redirect('/')
}

// 确定用户的状态 保持用户的状态
exports.keepLog = async (ctx,next)=>{
  if(ctx.session.isNew){// session没有 
    // cookie查询登录用户是否存在
    if(ctx.cookies.get('username')){
      ctx.session = {
        username:ctx.cookies.get('username'),
        uid:cts.cookies.get('uid')
      }
    }
  }
  await next()
}