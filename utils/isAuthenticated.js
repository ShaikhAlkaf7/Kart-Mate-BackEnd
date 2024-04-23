import jwt from "jsonwebtoken";
import ErrorClass from "./errorHandlerClass.js";

const isAuthenticated = (req, res, next) => {
  try {
    // Getting token from headers
    const { authorization } = req.headers;

    // Verifying if token exists
    if (!authorization)
      throw new ErrorClass(401, "Unauthorized access, please Login in", false);

    // Getting decoded token
    const decoded = jwt.verify(authorization, process.env.JWT_SECREAT_KEY);

    // Adding decoded token into req.user
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export default isAuthenticated;
