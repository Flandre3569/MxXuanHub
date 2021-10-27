const Router = require('koa-router');
const userRouter = new Router({ prefix: '/users' });
const { create } = require('../controller/user.controller');
const { verifyUser, handlePassword } = require('../middleware/user.middleware');

// 在此处只用来注册路由

userRouter.post('/',verifyUser, handlePassword, create);

module.exports = userRouter;