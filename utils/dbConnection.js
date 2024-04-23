import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then((e) => console.log(e.connection.host))
    .catch((error) => console.log(error));
};
