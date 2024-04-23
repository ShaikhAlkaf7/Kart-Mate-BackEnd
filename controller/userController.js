import User from "../models/userModel.js";
import { hashPassword } from "../utils/passwordUtils.js";
import ErrorClass from "../utils/errorHandlerClass.js";
import errorHandler from "../utils/asyncErrorHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signupConroller = errorHandler(async (req, res, next) => {
  // getting datga from request body for creating the user

  const { name, email, password, dob, role, phoneNumber } = req.body;

  // checking the user data send or not
  if (!name || !email || !password || !dob)
    return next(new ErrorClass(400, "All Fields are required ", false));

  // checking the user already exist or not
  const userExist = await User.find({ email });

  if (userExist?.length > 0)
    return next(new ErrorClass(409, "User Already Exits Please Login", false));

  // getting user age
  const today = new Date();
  let age = today.getFullYear() - new Date(dob).getFullYear();
  if (
    today.getMonth() < new Date(dob).getMonth() ||
    (today.getMonth() === new Date(dob).getMonth() &&
      today.getDate() < new Date(dob).getDate())
  )
    age--;

  // hashing the password
  const hashedPassword = hashPassword(password);

  // creating the user in db
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    dob: new Date(dob),
    role,
    age,
    phoneNumber,
  });

  // checking the user created or not
  if (!user) return next(422, "Error while crating the user", false);

  res.status(201).send({
    success: true,
    message: "Sigh up successfully ",
    user,
  });
});

export const loginController = errorHandler(async (req, res, next) => {
  // getting data from body for login
  const { email, password } = req.body;

  // validate the data
  if (!email || !password)
    return next(new ErrorClass(400, "All Fields are required ", false));

  // user exist or not
  const user = await User.findOne({ email });
  if (!user || user?.length < 0)
    return next(new ErrorClass(404, "User Not found Please Signup", false));

  // validating or camparing password
  const comparePassword = bcrypt.compareSync(password, user?.password);
  if (!comparePassword)
    return next(new ErrorClass(401, "Incorrect Email or Password"));

  // genrating token
  const token = jwt.sign({ id: user?._id }, process.env.JWT_SECREAT_KEY);

  // sending ok response
  res.status(200).send({
    success: true,
    message: "Login successfully",
    user: {
      userName: user?.name,
      email: user?.email,
      _id: user?._id,
      role: user?.role,
    },
    token,
  });
});

export const getUser = errorHandler(async (req, res, next) => {
  // getting id form params
  const userId = req.user.id;
  // find the user
  const user = await User.findOne({ _id: userId }, "-password");
  if (!user) return next(new ErrorClass(404, "User Not Found", false));

  //   sending the success response
  res.status(200).send({
    success: true,
    message: "User Found Sucessfull",
    user,
  });
});
