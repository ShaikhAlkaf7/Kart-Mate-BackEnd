import mongoose from "mongoose";

const cuponSchema = new mongoose.Schema({
  cupon: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const Cupon = mongoose.model("Cupon", cuponSchema);
export default Cupon;
