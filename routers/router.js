const Router = require('koa-router')
const user = require('../control/user')
const article = require('../control/article')
const router = new Router()

// 渲染主页
router.get('/',user.keepLog,article.getList)

router.get(/^\/user\/(?=reg|login)/, async (ctx) =>{
    // show 为 true 则显示注册   false 显示登录
    const show = /reg$/.test(ctx.path)
    await ctx.render('register',{show})
})

// 用户注册 路由
router.post('/user/reg',user.reg)

// 用户登录 路由
router.post('/user/login',user.login)

// 用户退出
router.get("/user/logout", user.logout)

// 文章的发表页面
router.get('/article',user.keepLog,article.addPage)

// 文章添加
router.post('/article',user.keepLog,article.add)

// 文章列表 分页 路由
router.get('/page/:id',article.getList)

module.exports = router