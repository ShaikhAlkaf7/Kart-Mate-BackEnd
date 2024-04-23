import ErrorClass from "../../utils/errorHandlerClass.js";
import errorHandler from "../../utils/asyncErrorHandler.js";
import User from "../../models/userModel.js";

// get all user
export const getAllUser = errorHandler(async (req, res, next) => {
  // getting the all users
  const users = await User.find({}, "-password");
  if (!users) return next(new ErrorClass(404, "Users Not Foud", false));

  res.status(200).send({
    success: true,
    message: "Users Found Successfully",
    users,
  });
});

// get single user
export const getUser = errorHandler(async (req, res, next) => {
  // getting id form params
  const { id } = req.params;

  // find the user
  const user = await User.findById(id, "-password");
  if (!user) return next(new ErrorClass(404, "User Not Found", false));

  //   sending the success response
  res.status(200).send({
    success: true,
    message: "User Found Sucessfull",
    user,
  });
});

// delete user
export const deleteUser = errorHandler(async (req, res, next) => {
  // getting user id from params
  const { id } = req.params;

  // finding and delete the user
  const user = await User.findByIdAndDelete(id);
  if (!user) return next(new ErrorClass(404, "User delation failed", false));

  // sending the normal success response
  res.status(200).send({
    success: true,
    message: "User deleted successfully",
    user,
  });
});
