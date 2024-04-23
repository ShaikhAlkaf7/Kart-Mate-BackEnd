import express from "express";
import dotenv from "dotenv";
// importing the user routes
import userRoute from "./routes/userRoute.js";
import productsRoutes from "./routes/productsRoutes.js";
import adminUserController from "./routes/adminRoutes/adminUserRoute.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import dashBoardRoutes from "./routes/adminRoutes/dashBoardRoutes.js";
import { connectDB } from "./utils/dbConnection.js";
import Stripe from "stripe";

dotenv.config();

// const stripeKey =  || "";
export const stripe = new Stripe(process.env.STRIPE_KEY);

const app = express();
app.use(express.json());

const port = 8000;
connectDB();
app.get("/", (req, res) => {
  res.send({ message: "Hi" });
});

// using the routes
app.use("/api/user", userRoute);
app.use("/api/admin", adminUserController);
app.use("/api/product", productsRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/dashboard", dashBoardRoutes);

// error handling middleware
app.use((err, req, res, next) => {
  const {
    status = 500,
    message = "Something went wrong",
    success = false,
  } = err;
  console.log(err);
  res.status(status).send({ message: message, success: success });
});

app.listen(port, () => {
  console.log(`server is started to port ${port}`);
});
