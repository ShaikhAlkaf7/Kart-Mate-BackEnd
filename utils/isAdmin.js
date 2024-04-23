import User from "../models/userModel.js";
import errorHandler from "./asyncErrorHandler.js";
import ErrorClass from "./errorHandlerClass.js";

export const isAdmin = errorHandler(async (req, res, next) => {
  // getting the user id fom req.user
  const userId = req?.user?.id;

  //   if userid not found empty or undefind
  if (!userId) return next(new ErrorClass(401, "Please Login ", false));

  // finding the user from userId
  const user = await User.findById(userId);
  //   if user not find
  if (!user) return next(new ErrorClass(404, "User Not foud", false));

  //   if user not admin
  if (user?.role != "admin")
    return next(new ErrorClass(401, "You are not admin its for admin", false));

  next();
});
