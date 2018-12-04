const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");

const { transport, makeANiceEmail } = require("../mail");
const { hasPermission } = require("../utils");

const Mutations = {
  createItem: async (parent, args, ctx, info) => {
    if (!ctx.request.userId) {
      throw new Error("You must be logged in to do that");
    }
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          // This is how we create a relationship between item and user
          user: {
            connect: {
              id: ctx.request.userId
            }
          },
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
    const item = await ctx.db.query.item({ where }, `{id title user{ id }}`);
    //2. check if they own that itme, or have the permissions
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(permission =>
      ["ADMIN", "ITEMDELETE"].includes(permission)
    );
    if (!ownsItem && !hasPermission) {
      throw new Error("You don't have the permission to do that!");
    }
    //3. Delete it!
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  signup: async (parent, args, ctx, info) => {
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
    createAndSetJWTToken(ctx, user.id);
    return user;
  },
  signin: async (parent, { email, password }, ctx, info) => {
    // 1. check if there is a user with that email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      //  maybe for dating platforms we shouldn't throw this info
      throw new Error(`No such user found for email ${email}`);
    }
    // 2. check if their password is correct
    const valid = await bcrypt.compare(password, user.password);
    // 3. generate JWT token
    if (!valid) {
      throw new Error(`Invalid password`);
    }
    createAndSetJWTToken(ctx, user.id);
    return user;
  },
  signout: (parent, args, ctx, info) => {
    ctx.response.clearCookie("token");
    return { message: "Goodbye!" };
  },
  requestReset: async (parent, args, ctx, info) => {
    //1. Check if this is a real user
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) throw new Error(`No such user forund for email ${args.email}`);
    // 2. Set a reset token and expiry on that user
    const resetToken = (await promisify(randomBytes)(20)).toString("hex");
    const resetTokenExpiry = Date.now + 360000; // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    });
    // TODO: 3. Email them that reset token
    const mailRes = await transport.sendMail({
      from: "carloslouredaparrado@gmail.com",
      to: user.email,
      subject: "Your password reset token",
      html: makeANiceEmail(
        `Your Password Reset Token is here! \n\n <a href="${
          process.env.FRONTEND_URL
        }/reset?resetToken=${resetToken}">Click here to Reset</a>`
      )
    });

    return { message: "Thanks!" };
  },
  resetPassword: async (parent, args, ctx, info) => {
    let { password, confirmPassword, resetToken } = args;
    //1. Check if the passwords match
    if (password !== confirmPassword) {
      throw new Error("Oops! Passwords do not match.");
    }
    // 2 Check if its a legit reset token
    // 3. Check i its expired
    const [user] = await ctx.db.query.users({
      where: { resetToken, resetTokenExpiry_gte: Date.now() - 360000 }
    });
    if (!user) throw new Error("Not valid reset password link or expired");
    // 4. Hash their pasword
    password = await bcrypt.hash(password, 10);
    // 5. Save the new password to the user and remove old resettoekn
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: { password, resetToken: null, resetTokenExpiry: null }
    });
    // 6. Generate JWT
    // 7. Set the JWT cookie
    createAndSetJWTToken(ctx, updatedUser.id);
    // 8. Return the new user
    return updatedUser;
  },
  updatePermissions: async (parent, args, ctx, info) => {
    console.log("[MUTATION] updatePermissions");
    // 1. Check if they are logged in
    if (!ctx.request.userId) throw new Error("You must be logged in!");
    // 2. Query the current user
    const currentUser = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId
        }
      },
      info
    );
    // 3. Check if they have permissions to do this
    hasPermission(currentUser, ["ADMIN", "PERMISSIONUPDATE"]);
    // 4. Update the permissions
    return ctx.db.mutation.updateUser(
      {
        data: { permissions: { set: args.permissions } },
        where: { id: args.userId }
      },
      info
    );
  }
};

createAndSetJWTToken = (ctx, userId) => {
  const token = jwt.sign({ userId }, process.env.APP_SECRET);
  ctx.response.cookie("token", token, {
    httpOnly: true, // avoid JS to access the cookie
    maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
  });
};

module.exports = Mutations;
