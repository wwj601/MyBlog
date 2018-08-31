const Router = require('koa-router')
const router = new Router()

router.get('/',async (ctx) => {
    
    await ctx.render('index',{
        title:'个人博客',
        session:{
            isNew:true,
            role:666,
            avatar:'/img/1.jpg',
            username:'阿杰'
        }
    })
    
})

router.get(/^\/user\/(?=reg|login)/, async (ctx) =>{
    // show 为 true 则显示注册   false 显示登录
    const show = /reg$/.test(ctx.path)
    await ctx.render('register',{show})
})





module.exports = router