const errorTypes = require('../constants/error-types');

const errorHandler = (error, ctx) => {
  let status, message;
  switch (error.message) {
    case errorTypes.NAME_OR_PASSWORD_IS_REQUIRED:
      status = 400; // Bad Request
      message = '用户名或密码不能为空';
      break;
    case errorTypes.USER_ALREADY_EXISTS:
      status = 409; //Conflict
      message = '用户已存在';
      break;
    case errorTypes.USER_NOT_EXISTS:
      status = 409; //conflict
      message = '用户不存在';
      break;
    case errorTypes.PASSWORD_NOT_CORRECR:
      status = 400; // Bad Request
      message = '密码不正确';
      break;
    case errorTypes.UNAUTHORIZATION:
      status = 401; // unauthorization token
      message = '无效的token';
      break;
    case errorTypes.UNPERMISSION:
      status = 401;
      message = '您没有操作的权限';
      break;
    default:
      status = 404;
      message = 'NOT FOUND';
  }

  ctx.statue = status;
  ctx.body = message;
}

module.exports = errorHandler;