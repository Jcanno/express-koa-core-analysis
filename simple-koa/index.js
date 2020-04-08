const Koa = require('./application');
const app = new Koa();
const router = require('./router')();

app.use(async(ctx, next) => {
	console.log('first middleware');
	await next();
});

router.get('/hello', async(ctx, next) => {
	console.log('hello');
	ctx.res.end('hello')
})


app.use(async(ctx, next) => {
	console.log('second middleware');
	await next();
});

app.use(router.routes())

app.listen(3001, () => {
  console.log('服务已运行');
});