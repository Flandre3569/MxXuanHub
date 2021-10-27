const Router = require('koa-router');

const momentRouter = new Router({ prefix: '/moment' });
const { create, detail, list, update, remove, addLabels } = require('../controller/moment.controller');
const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware');
const { verifyLabelExists } = require('../middleware/label.middleware');

momentRouter.post('/', verifyAuth, create);
momentRouter.get('/', list);
momentRouter.get('/:momentId', detail);

// 用户必须登录   用户必须具有权限
momentRouter.patch('/:momentId', verifyAuth, verifyPermission, update);
momentRouter.delete('/:momentId', verifyAuth, verifyPermission, remove);

// 给动态添加标签
momentRouter.post('/:momentId/labels', verifyAuth, verifyPermission, verifyLabelExists, addLabels);

module.exports = momentRouter;