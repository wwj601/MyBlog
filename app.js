const Koa = require('koa')
const logger = require('koa-logger')
const static = require('koa-static')
const views = require('koa-views')
const body = require('koa-body')
const router = require('./routers/router')
const { join } = require('path')
const session = require('koa-session')

// 生成koa实例
const app = new Koa()


app.keys = ['it is Adger'];
// session 的配置对象
const CONFIG = {
    key: "Sid",
    maxAge: 36e5,
    overwrite: true,
    httpOnly: true,
    signed: false,
    rolling: true
}

// 注册session
app.use(session(CONFIG, app))

// // 生成日志模板
// app.use(logger())


// 配置 koa-body 处理 post 请求数据
app.use(body())

// 配置试图模板
app.use(views(join(__dirname,'views'),{
    extension:'pug'
}))
// 配置静态资源目录
app.use(static(join(__dirname,'public')))

// 注册路由信息
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000,()=>{
    console.log('项目启动成功，监听在3000端口')
})