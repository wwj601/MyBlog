const Koa = require('koa')
const logger = require('koa-logger')
const static = require('koa-static')
const views = require('koa-views')
const router = require('./routers/router')
const { join } = require('path')

// 生成koa实例
const app = new Koa()

// 生成日志模板
app.use(logger())

// 配置试图模板
app.use(static(join(__dirname,'views'),{
    extensions:'pug'
}))
// 配置静态资源目录
app.use(static(join(__dirname,'public')))

// 注册路由信息
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000,()=>{
    console.log('项目启动成功，监听在3000端口')
})