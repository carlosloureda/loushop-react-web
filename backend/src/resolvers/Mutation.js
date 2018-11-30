const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Mutations = {
  createItem: async (parent, args, ctx, info) => {
    // TODO: check if they are logged in
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );
    return item;
  },
  updateItem: async (parent, args, ctx, info) => {
    // first take a copy of the updates
    const updates = { ...args };
    // remove the ID from the updates;
    delete updates.id;
    // run the update method
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },
  deleteItem: async (parent, args, ctx, info) => {
    const where = { id: args.id };
    // 1.find the item
    const item = await ctx.db.query.item({ where }, `{id title}`);
    //2. check if they own that itme, or have the permissions
    //TODO:
    //3. Delete it!
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  signup: async (parent, args, ctx, info) => {
    console.log(args);
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] }
        }
      },
      info
    );

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // Set te jsw as a cookie for the response
    ctx.response.cookie("token", token, {
      httpOnly: true, // avoid JS to access the cookie
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });
    return user;
  }
};

module.exports = Mutations;
