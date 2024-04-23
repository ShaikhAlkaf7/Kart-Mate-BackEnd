import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
import User from "../../models/userModel.js";
import errorHandler from "../../utils/asyncErrorHandler.js";
import { calculatePercentage } from "../../utils/calculatePercentage.js";
import { getChartData } from "../../utils/getCharData.js";

export const statsController = errorHandler(async (req, res, next) => {
  // creating the logic for geting stats
  const today = new Date();
  const sixMonthAgo = new Date();
  sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

  const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );

  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  // getting product based on condition
  const thisMonthsProduct = await Product.find({
    createdAt: {
      $gte: startOfThisMonth,
      $lte: today,
    },
  });

  const lastMonthsProduct = await Product.find({
    createdAt: {
      $gte: startOfLastMonth,
      $lte: endOfLastMonth,
    },
  });

  // getting user  based on condition for
  const thisMonthsUser = await User.find({
    createdAt: {
      $gte: startOfThisMonth,
      $lte: today,
    },
  });

  const lastMonthsUser = await User.find({
    createdAt: {
      $gte: startOfLastMonth,
      $lte: endOfLastMonth,
    },
  });

  // getting order  based on condition for
  const thisMonthsOrder = await Order.find({
    createdAt: {
      $gte: startOfThisMonth,
      $lte: today,
    },
  });

  const lastMonthsOrder = await Order.find({
    createdAt: {
      $gte: startOfLastMonth,
      $lte: endOfLastMonth,
    },
  });

  const productCount = await Product.countDocuments();
  const userCount = await User.countDocuments();
  const allOrders = await Order.find({}).select("total");
  const categories = await Product.distinct("category");

  const productChangePercentage = calculatePercentage(
    thisMonthsProduct?.length,
    lastMonthsProduct?.length
  );

  const userChangePercentage = calculatePercentage(
    thisMonthsUser.length,
    lastMonthsUser.length
  );

  const orderChangePercentage = calculatePercentage(
    thisMonthsOrder?.length,
    lastMonthsOrder?.length
  );

  const thisMonthRevenve = thisMonthsOrder?.reduce(
    (total, order) => total + (order.total || 0),
    0
  );

  const lastMonthRevenve = lastMonthsOrder?.reduce(
    (total, order) => total + (order.total || 0),
    0
  );
  const monthlyRevenue = calculatePercentage(
    thisMonthRevenve,
    lastMonthRevenve
  );

  const revenue = allOrders?.reduce(
    (total, order) => total + (order.total || 0),
    0
  );

  const lastSixMonthsOrders = await Order.find({
    createdAt: {
      $gte: sixMonthAgo,
      $lte: today,
    },
  });

  const orderMonthCout = new Array(6).fill(0);
  const ordermonthlyRevenue = new Array(6).fill(0);

  lastSixMonthsOrders.forEach((order) => {
    const creationDate = order?.createdAt;
    const monthlyDiff = (today.getMonth() - creationDate?.getMonth() + 12) % 12;

    if (monthlyDiff < 6) {
      orderMonthCout[6 - monthlyDiff - 1] += 1;
      ordermonthlyRevenue[6 - monthlyDiff - 1] += order?.total;
    }
  });

  const categoriesCountPromise = categories?.map((category) =>
    Product.countDocuments({ category })
  );

  const latestTransaction = await Order.find({}, "-shippingInfo").limit(4);

  const categoriesCount = await Promise.all(categoriesCountPromise);

  const categoryCount = [];

  categories.forEach((category, i) => {
    categoryCount.push([
      [category],
      Math.round((categoriesCount[i] / productCount) * 100),
    ]);
  });

  const stats = {
    productChangePercentage,
    userChangePercentage,
    orderChangePercentage,
    monthlyRevenue,
    userCount,
    productCount,
    orderCount: allOrders?.length,
    revenue,
  };

  // sending the normal res
  res.status(200).send({
    success: true,
    stats,
    chart: {
      order: orderMonthCout,
      revenue: ordermonthlyRevenue,
    },
    categoryCount,
    latestTransaction,
  });
});

export const pieController = errorHandler(async (req, res, next) => {
  // getting all order status
  const processingOrder = await Order.countDocuments({ status: "Processing" });
  const shippedgOrder = await Order.countDocuments({ status: "Shipped" });
  const deliveredOrder = await Order.countDocuments({ status: "Delivered" });

  // now getting category ratio from here
  const categories = await Product.distinct("category");
  const categoriesCountPromise = categories?.map((category) =>
    Product.countDocuments({ category })
  );
  const categoriesCount = await Promise.all(categoriesCountPromise);

  const categoryCount = [];
  const inStock = await Product.countDocuments();

  categories.forEach((category, i) => {
    categoryCount.push({
      [category]: Math.round((categoriesCount[i] / inStock) * 100),
    });
  });
  //  to here getting all categories

  // stock avlability
  const outOfStock = await Product.countDocuments({ stock: 0 });
  const stockAvalability = [inStock, outOfStock];

  // now we create a revenue distrubition - from here to
  // getting all order
  const orders = await Order.find({}).select([
    "total",
    "discout",
    "subtotal",
    "tax",
    "shippingCharges",
  ]);

  const grossIncome = orders?.reduce(
    (prev, order) => prev + (order?.total || 0),
    0
  );

  const discount = orders?.reduce(
    (prev, order) => prev + (order?.discout || 0),
    0
  );

  const productionCost = orders?.reduce(
    (prev, order) => prev + (order?.shippingCharges || 0),
    0
  );

  const burn = orders?.reduce((prev, order) => prev + (order?.tax || 0), 0);

  const marketingCost = Math.round(grossIncome * (30 / 100));

  const netMargin =
    grossIncome - discount - productionCost - burn - marketingCost;

  const revenueDistribution = [
    netMargin,
    discount,
    productionCost,
    burn,
    marketingCost,
  ];

  // to here

  // getting the user age group & user roles
  const getUserAgeGroup = await User.find({}).select("age");
  const userAdminRole = await User.countDocuments({ role: "admin" });
  const userRole = await User.countDocuments({ role: "user" });

  // now sending the user roles
  const userRoles = {
    admin: userAdminRole,
    user: userRole,
  };

  // all three status wrap into object orderFulfilment
  const orderFullFilment = [processingOrder, shippedgOrder, deliveredOrder];

  // wrap the user age group
  const userAgeGroup = {
    teen: getUserAgeGroup?.filter((i) => i.age <= 20).length,
    audult: getUserAgeGroup?.filter((i) => i.age <= 40 && i.age > 20).length,
    old: getUserAgeGroup?.filter((i) => i.age > 40).length,
  };

  // sending the normal res
  res.status(200).send({
    success: true,
    charts: {
      orderFullFilment,
      categoryCount,
      stockAvalability,
      revenueDistribution,
      userRoles,
      userAgeGroup,
    },
  });
});

export const barController = errorHandler(async (req, res, next) => {
  const today = new Date();
  // getting six months ago cus or pro
  const sixMonthAgo = new Date();
  sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

  // gettinh full years order
  const twelveMonthAgo = new Date();
  twelveMonthAgo.setMonth(twelveMonthAgo.getMonth() - 12);

  const lastSixMonthsProduct = await Product.find({
    createdAt: {
      $gte: sixMonthAgo,
      $lte: today,
    },
  });

  const lastSixMonthsUser = await User.find({
    createdAt: {
      $gte: sixMonthAgo,
      $lte: today,
    },
  });

  const fullYearOrders = await Order.find({
    createdAt: {
      $gte: twelveMonthAgo,
      $lte: today,
    },
  });

  const productCount = getChartData(6, lastSixMonthsProduct);
  const userCount = getChartData(6, lastSixMonthsUser);
  const orderCount = getChartData(12, fullYearOrders);

  const chart = {
    productCount,
    userCount,
    orderCount,
  };

  //sending the normal res
  res.status(200).send({
    success: true,
    message: "Bar chats fetch successfully",
    chart,
  });
});

export const lineController = errorHandler(async (req, res, next) => {
  const today = new Date();

  // gettinh full years order
  const twelveMonthAgo = new Date();
  twelveMonthAgo.setMonth(twelveMonthAgo.getMonth() - 12);

  const fullYearProduct = await Product.find({
    createdAt: {
      $gte: twelveMonthAgo,
      $lte: today,
    },
  });

  const fullYearUser = await User.find({
    createdAt: {
      $gte: twelveMonthAgo,
      $lte: today,
    },
  });

  const fullYearOrders = await Order.find({
    createdAt: {
      $gte: twelveMonthAgo,
      $lte: today,
    },
  });

  const productCount = getChartData(12, fullYearProduct);
  const userCount = getChartData(12, fullYearUser);
  const discount = getChartData(12, fullYearOrders, "discout");
  const revenue = getChartData(12, fullYearOrders, "total");

  const chart = {
    productCount,
    userCount,
    // orderCount,
    discount,
    revenue,
  };

  //sending the normal res
  res.status(200).send({
    success: true,
    message: "Line chats fetch successfully",
    chart,
  });
});
