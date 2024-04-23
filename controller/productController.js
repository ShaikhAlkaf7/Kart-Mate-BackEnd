import Product from "../models/productModel.js";
import errorHandler from "../utils/asyncErrorHandler.js";
import ErrorClass from "../utils/errorHandlerClass.js";

// creating the new product
export const createProductController = errorHandler(async (req, res, next) => {
  // getting data from body for creating the product
  let { name, description, photo, price, stock, category } = req.body;

  // validating the data get or not
  if (!name || !description || !photo || !price || !stock || !category)
    return next(new ErrorClass(401, "All filds are required", false));

  // performing the some actions on data before creating the data
  category = category.toLowerCase().trim();

  // now creating the product
  const product = await Product.create({
    name,
    description,
    photo,
    price,
    stock,
    category,
  });

  if (!product)
    return next(new ErrorClass(404, "Product creating failed", false));

  res.status(201).send({
    success: true,
    message: "Product created successfully",
    product,
  });
});

// getting  the latst product - chacheDone
export const latestProductController = errorHandler(async (req, res, next) => {
  const products = await Product.find({}).sort({ createdAt: -1 }).limit(10);

  if (!products) return next(new ErrorClass(404, "Producs not found", false));

  res.status(200).send({
    success: true,
    message: "Latest Product found successfully",
    products,
  });
});

// getting category - chacheDone
export const getCategoriesController = errorHandler(async (req, res, next) => {
  // creatign the variable for categories for sore categories agter chaching

  // getting category fomr products
  const categories = await Product.distinct("category");

  res.status(200).send({
    success: true,
    message: "Category fetch successfully",
    categories,
  });
});

// get all product for admin - chacheDone
export const getAdminAllProductsController = errorHandler(
  async (req, res, next) => {
    // deleare variable for products

    // getting the latest 10 prodct for home page
    const products = await Product.find({});

    if (!products) return next(new ErrorClass(404, "Producs not found", false));

    res.status(200).send({
      success: true,
      message: "Latest Product found successfully",
      products,
    });
  }
);

// getting single product
export const getSingleProductController = errorHandler(
  async (req, res, next) => {
    // getting id from params

    const { id } = req.params;
    if (!id) return next(new ErrorClass(404, "Please Provide id ", false));

    // now finding the product
    const product = await Product.findById(id);

    // validate the product found or not
    if (!product) return next(new ErrorClass(404, "Product not found", false));

    // sending the normal res
    res.status(200).send({
      success: true,
      message: "Product found successfully",
      product,
    });
  }
);

// updating the product by id
export const updateProductController = errorHandler(async (req, res, next) => {
  // getting id from params
  const { id } = req.params;

  // first find the product
  const findProduct = await Product.findById(id);

  if (!findProduct)
    return next(new ErrorClass(404, "Product Not found", false));

  // getting data from body for updating the product
  let { name, description, photo, price, stock, category } = req.body;

  // validating the data
  if (!name || !description || !photo || !price || !stock || !category)
    return next(new ErrorClass(401, "All filds are required", false));

  // performing the some actions on data before creating the data
  category = category.toLowerCase().trim();

  // now creating the product
  const product = await Product.findByIdAndUpdate(
    id,
    {
      name,
      description,
      photo,
      price,
      stock,
      category,
    },
    { new: true }
  );

  if (!product)
    return next(new ErrorClass(404, "Product Updation failed", false));

  res.status(201).send({
    success: true,
    message: "Product updated successfully",
    product,
  });
});

// deleting the product by id
export const deleteProductController = errorHandler(async (req, res, next) => {
  // getting id form params
  const { id } = req.params;
  console.log(id);

  // first find the product
  const findProduct = await Product.findById(id);

  if (!findProduct)
    return next(new ErrorClass(404, "Product Not found", false));

  const product = await Product.findByIdAndDelete(id);

  if (!product)
    return next(new ErrorClass(404, "Product Deletation failed", false));

  // sending the success responses
  res.status(200).send({
    success: true,
    message: "Product deletation successfully",
    product,
  });
});

// search products by query
export const searchProductController = errorHandler(async (req, res, next) => {
  // getting search query from req.query
  const { search, sort, category, price } = req.query;

  // writing the logic for pagination
  const page = req.query.page || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  // we dont add the option directly in the search first we decleare the opotion or validate the option get or not first we create a empth object and then we added the object with turnary obrator

  const options = {};
  search ? (options.name = { $regex: search, $options: "i" }) : "";
  price ? (options.price = { $lte: price }) : "";
  category ? (options.category = category) : "";

  const [products, totalProduct] = await Promise.all([
    Product.find(options)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip),
    Product.find(options),
  ]);

  // getting product lentht whithout limit skip

  const totalPage = Math.ceil(totalProduct?.length / limit);

  if (!products) return next(new ErrorClass(404, "Producs not found", false));

  res.status(200).send({
    success: true,
    message: " Product found successfully",
    products,
    totalPage,
  });
});
