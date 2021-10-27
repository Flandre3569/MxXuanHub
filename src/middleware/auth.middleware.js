const userService = require('../service/user.service');
const authService = require('../service/auth.service');
const errorTypes = require('../constants/error-types');
const md5password = require('../utils/password-handle');
const jwt = require('jsonwebtoken');
const { PUBLIC_KEY } = require('../app/config');

const verifyLogin = async (ctx, next) => {
  // 获取用户名和密码
  const { name, password } = ctx.request.body;

  // 判断用户名和密码不为空
  if (!name || !password) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit('error', error, ctx);
  }
  
  // 判断是否有该用户
  const result = await userService.getUserByName(name);
  const user = result[0];
  if (!user) {
    const error = new Error(errorTypes.USER_NOT_EXISTS);
    return ctx.app.emit('error', error, ctx);
  }

  // 判断密码是否正确
  ctx.request.body.password = md5password(ctx.request.body.password);
  if (user.password !== ctx.request.body.password) {
    const error = new Error(errorTypes.PASSWORD_NOT_CORRECR);
    return ctx.app.emit('error', error, ctx);
  }

  ctx.user = user;
  await next();
}

const verifyAuth = async (ctx, next) => {
  // 获取token
  const authorization = ctx.headers.authorization;
  if (!authorization) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    return ctx.app.emit('error', error, ctx);
  }
  const token = authorization.replace('Bearer ', '');

  // 验证token
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"]
    })
    ctx.user = result;
    await next();
  } catch (err) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    return ctx.app.emit('error', error, ctx);
  }
  
}

// 闭包函数思路
// const verifyPermission = (tableName) => {
//   return async (ctx, next) => {
//     console.log(`验证权限的middleware`);
  
//     // 获取参数
//     const { momentId } = ctx.params;
//     const { id } = ctx.user;
  
//     // 查询是否具有权限
//     try {
//       const isPermission = await authService.checkResource(tableName, momentId, id);
//       if (!isPermission) {
//         throw new Error();
//       }
//       await next();
//     } catch (err) {
//       const error = new Error(errorTypes.UNPERMISSION);
//       return ctx.app.emit('error', error, ctx);
//     }
//   }
// }

const verifyPermission = async (ctx, next) => {
  console.log(`验证权限的middleware`);

  const [resourceKey] = Object.keys(ctx.params);
  // 获取参数
  const tableName = resourceKey.replace('Id', '');
  const resourceId = ctx.params[resourceKey];
  // const { momentId } = ctx.params;
  const { id } = ctx.user;

  // 查询是否具有权限
  try {
    const isPermission = await authService.checkResource(tableName, resourceId, id);
    if (!isPermission) {
      throw new Error();
    }
    await next();
  } catch (err) {
    const error = new Error(errorTypes.UNPERMISSION);
    return ctx.app.emit('error', error, ctx);
  }
}

module.exports = {
  verifyLogin,
  verifyAuth,
  verifyPermission
}