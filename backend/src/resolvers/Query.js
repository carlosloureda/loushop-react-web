const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");

const Query = {
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me: (parent, args, ctx, info) => {
    // check if there is ac current user ID
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    );
  },
  users: async (parent, args, ctx, info) => {
    if (!ctx.request.userId) throw new Error("You must be logged in!");
    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);
    return ctx.db.query.users({}, info);
  },
  order: async (parent, args, ctx, info) => {
    if (!ctx.request.userId) throw new Error("You must be logged in!");
    const order = await ctx.db.query.order(
      {
        where: { id: args.id }
      },
      info
    );
    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes(
      "ADMIN"
    );
    if (!ownsOrder || !hasPermission) throw new Error("You can't see this");
    return order;
  },
  orders: async (parent, args, ctx, info) => {
    const { userId } = ctx.request;
    if (!userId) throw new Error("You must be logged in!");
    console.log("userId: ", userId);
    return ctx.db.query.orders(
      {
        where: {
          user: { id: userId }
        }
      },
      info
    );
  }
};

module.exports = Query;
