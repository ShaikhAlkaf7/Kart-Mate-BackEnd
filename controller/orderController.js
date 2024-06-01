import { stripe } from "../app.js";
import Order from "../models/orderModel.js";
import errorHandler from "../utils/asyncErrorHandler.js";
import { reduceStock } from "../utils/cachingRevalidate.js";
import ErrorClass from "../utils/errorHandlerClass.js";

// new order controller
export const newOrderController = errorHandler(async (req, res, next) => {
  // getting data from body
  const {
    shippingInfo,
    subtotal,
    tax,
    shippingCharges,
    discout,
    total,
    status,
    orderItems,
  } = req.body;

  // validating the data get or not
  // if (
  //   !shippingInfo ||
  //   !subtotal ||
  //   !tax ||
  //   !shippingCharges ||
  //   !discout ||
  //   !total ||
  //   !orderItems
  // ) {
  //   return next(new ErrorClass(400, "All fileds are required", false));
  // }

  // now creating the order
  const order = await Order.create({
    shippingInfo,
    user: req?.user?.id,
    subtotal,
    tax,
    shippingCharges,
    discout,
    total,
    status,
    orderItems,
  });

  await reduceStock(orderItems);

  res.status(200).send({
    success: true,
    message: "Order Created Successfuly",
    order,
  });
});

// get all my orders
export const myOrderController = errorHandler(async (req, res, next) => {
  // getting user id for searching users all orders
  const userId = req?.user?.id;

  const orders = await Order.find({ user: userId });

  if (!orders) return next(new ErrorClass(404, "Orders Not Found", false));

  res.status(200).send({
    success: true,
    message: "Orders Found Successfully",
    orders,
  });
});

// get all orders for admin
export const allOrdersController = errorHandler(async (req, res, next) => {
  // initializing the variable for orders

  const orders = await Order.find().populate("user", "-password");

  if (!orders) return next(new ErrorClass(404, "Products Not Found", false));

  // sending the normal response
  res.status(200).send({
    success: true,
    message: "all orders fetch Successfully",
    orders,
  });
});

export const getSingleOrderController = errorHandler(async (req, res, next) => {
  // getting id from params for fetching the single order
  const { id } = req.params;

  const order = await Order.findById(id).populate("user", "-password");
  if (!order) return next(new ErrorClass(404, "Order Not found", false));

  // sending the normal response
  res.status(200).send({
    success: true,
    message: "Order Fetch Successfully",
    order,
  });
});

// adding the processing and updation of order
export const processOrderController = errorHandler(async (req, res, next) => {
  // getting the id from params for processing the order
  const { id } = req.params;

  // getting the data for updating request for data's status
  const { status } = req.body;

  if (!status)
    return next(new ErrorClass(404, "Status for updating not found", false));

  // finding the order from id
  const order = await Order.findById(id);
  if (!order) return next(new ErrorClass(404, "Order Not Found", false));

  // now we want to check if user should not update previus values ex. from deleverd to shipped
  if (status == "Shipped" && order.status == "Delivered")
    return next(
      new ErrorClass(404, "You Cannot Reverse the order Status", false)
    );
  if (status == "Processing" && order.status == "Shipped")
    return next(
      new ErrorClass(404, "You Cannot Reverse the order Status", false)
    );
  if (
    (status == "Processing" && order?.status == "Shipped") ||
    order?.status == "Delivered"
  )
    return next(new ErrorClass(404, "You Cant reverse The order Status"));

  // now update the status of order
  const statusUpdate = await Order.findByIdAndUpdate(id, { status });

  if (!statusUpdate)
    return next(new ErrorClass(404, "Order Updating Failed", false));

  // sending the normal res
  res.status(200).send({
    success: true,
    message: "Order Updated Successfully",
    statusUpdate,
  });
});

// deleting the order
export const deleteOrderController = errorHandler(async (req, res, next) => {
  // getting the id of order for delete from params
  const { id } = req.params;

  // checking the order exists or not
  const checkOrder = await Order.findById(id);
  if (!checkOrder) return next(new ErrorClass(404, "order not found", false));

  const order = await Order.findByIdAndDelete(id);

  // sending the normal res
  res.status(200).send({
    success: true,
    message: "Order Deleted Successfully",
    order,
  });
});
