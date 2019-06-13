const Koa = require('koa')
const router = require('koa-router')()
const stc = require('koa-static')
const koaBody = require('koa-body')
const cors = require('koa2-cors')
const mkdirp = require('mkdirp')
const static = require('koa-static')
const fs = require('fs')
const path = require('path')
const app = new Koa()

app.use(cors())

app.use(static(__dirname));

app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200 * 1024 * 1024
    }
}))


router.post('/upload', async ctx => {
    const file = ctx.request.files.image
    if(file) {
        const reader = fs.createReadStream(file.path)
        const ext = file.name.split('.').pop()
        const filename = file.name.split('.').shift()
        const uploadPath = path.resolve(__dirname, "./static/images")
        const flag = fs.existsSync(uploadPath)
        if (!flag) mkdirp.sync(uploadPath)
        const upStream = fs.createWriteStream(`${uploadPath}/${filename}.${ext}`)
        await reader.pipe(upStream)
        ctx.body = {"code": 200, "description": "成功保存图片"};
    }else {
        ctx.body = {"code": 201, "description": "没有选择图片"};
    }
})

app.use(router.routes())

app.listen(8999, () => {
    console.log('server is running, http://localhost:8999')
})