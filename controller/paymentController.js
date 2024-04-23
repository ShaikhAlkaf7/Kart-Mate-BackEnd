import { stripe } from "../app.js";
import Cupon from "../models/cuponModel.js";
import errorHandler from "../utils/asyncErrorHandler.js";
import ErrorClass from "../utils/errorHandlerClass.js";

export const createPayment = errorHandler(async (req, res, next) => {
  const { amount } = req.body;

  //   valdating the data recive or not from body
  if (!amount)
    return next(new ErrorClass(404, "All fileds are required", false));

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: "INR",
  });

  res.status(200).send({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});

// genreting the cupon
export const newCuponController = errorHandler(async (req, res, next) => {
  // getting the cupon from body
  const { cupon, amount } = req.body;

  //   valdating the data recive or not from body
  if (!cupon && !amount)
    return next(new ErrorClass(404, "All fileds are required", false));

  await Cupon.create({ cupon, amount });

  res.status(200).send({
    success: true,
    message: `Cupen ${cupon} genreted Successfully`,
  });
});

// validating and give the discount for the order and full cart
export const applyDiscountController = errorHandler(async (req, res, next) => {
  // getting the cupon form request query
  const { cupon } = req.query;

  const discount = await Cupon.findOne({ cupon });

  if (!discount) return next(new ErrorClass(404, "Invalid Cupon", false));

  // sending the normal res

  res.status(200).send({
    success: true,
    discount: discount?.amount,
  });
});

// finding the all cupons who are avalable in db
export const getAllCuponsController = errorHandler(async (req, res, next) => {
  const cupons = await Cupon.find();
  if (!cupons || cupons.length <= 0)
    return next(new ErrorClass(404, "Cpuons are not found", false));

  // sendig the normal res
  res.status(200).send({
    success: true,
    message: "Cupon Found Successfuly",
    cupons,
  });
});

// delete the cupon
export const cuponDeleteController = errorHandler(async (req, res, next) => {
  // getting the id from params
  const { id } = req.params;

  // first we find the copun
  const cupon = await Cupon.findById(id);
  if (!cupon)
    return next(
      new ErrorClass(
        404,
        "It Seems This cupon already deleted or not exits ",
        false
      )
    );

  const deleteCupon = await Cupon.findByIdAndDelete(id);
  if (!deleteCupon)
    return next(new ErrorClass(404, "cupon deletion failed", false));

  // sending the normal res
  res.status(200).send({
    success: true,
    message: "Cupon deletion successfully ",
    deleteCupon,
  });
});
