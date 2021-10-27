const momentService = require('../service/moment.service');

class MomentController {
  async create(ctx, next) {
    // 获取user_id和content
    const userId = ctx.user.id;
    const content = ctx.request.body.content;
    console.log(userId, content);
    
    // 将数据插入到数据库里
    const result = await momentService.create(userId, content);
    ctx.body = result;
    await next();
  }

  async detail(ctx,next) {
    // 获取数据(momentId)
    const momentId = ctx.params.momentId;

    // 根据id去查询这条数据
    const result = await momentService.getMomentById(momentId);
    ctx.body = result;
    await next();
  }
  async list(ctx, next) {
    // 获取数据offset/size
    const { offset, size } = ctx.query;

    // 查询对应的数据
    const result = await momentService.getMomentList(offset, size);
    ctx.body = result;
    await next();
  }
  async update(ctx, next) {
    // 获取参数
    const { momentId } = ctx.params;
    const { content } = ctx.request.body;

    // 修改内容
    const result = await momentService.update(content, momentId);
    ctx.body = result;
  }
  async remove(ctx, next) {
    // 获取momentId即可。
    const { momentId } = ctx.params;

    // 删除内容
    const result = await momentService.remove(momentId);
    ctx.body = result;
  }
  async addLabels(ctx, next) {
    // 获取标签和动态id
    const { labels } = ctx;
    const { momentId } = ctx.params;
    console.log(labels);
    console.log(momentId);

    // 添加所有的标签
    for (let label of labels) {
      // 判断标签是否和动态已经有关系了
      const isExist = await momentService.hasLabel(momentId, label.id);
      if (!isExist) {
        await momentService.addLabel(momentId, label.id);
      }
    }
    ctx.body = `给动态添加标签成功`;
  }
}

module.exports = new MomentController();