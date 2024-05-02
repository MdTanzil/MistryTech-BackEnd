const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { Product } = require("../models");
const { fileUpload } = require("../config");
const express = require("express");

const productRouter = express.Router();
// status code import

// get product
productRouter.get("/", async (req, res) => {
  const perPage = parseInt(req.query.perPage) || 10;
  // Number of product per page (default is 10)
  const page = parseInt(req.query.page) || 1; // Page number (default is 1)
  try {
    // Find total number of product
    const totalProduct = await Product.countDocuments();

    // Calculate total number of pages
    const totalPages = Math.ceil(totalProduct / perPage);

    // Calculate the starting index of product for the requested page
    const startIndex = (page - 1) * perPage;

    // Query product for the requested page
    const products = await Product.find()
      .sort({ createdAt: "desc" })
      .populate("variants")
      .skip(startIndex)
      .limit(perPage);

    res.status(StatusCodes.OK).json({
      totalPages,
      currentPage: page,
      total: totalProduct,
      products,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
});

//Add a product
productRouter.post("/", fileUpload.array("images", 10), async (req, res) => {
  try {
    // Extract image paths from req.files
    const imagePaths = req.files.map((file) => file.path);
    // Create a new product with image paths
    const product = new Product({
      ...req.body,
      images: imagePaths,
    });
    await product.save();
    res.status(StatusCodes.OK).json(product);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: error.message,
    });
  }
});

//get a specific product

productRouter.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: ReasonPhrases.NOT_FOUND,
      });
    }

    res.send(product);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
});

//update a product

productRouter.put("/:id", fileUpload.array("images", 10), async (req, res) => {
  try {
    const id = req.params.id;
    const productData = req.body;

    // Find the product by ID
    let product = await Product.findById(id);

    // If the product doesn't exist, return 404
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: "Product not found",
      });
    }

    // Extract image paths from req.files if images are provided
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map((file) => file.path);
    }

    // Update the product with the new data
    product.set({
      ...productData,
      images: imagePaths.length > 0 ? imagePaths : product.images, // Keep existing images if not provided in the request
    });

    // Save the updated product
    await product.save();

    // Return the updated product
    res.status(StatusCodes.OK).json(product);
  } catch (error) {
    // If any error occurs, return 400 with error message
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: error.message,
    });
  }
});

//Delete a product

productRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: ReasonPhrases.NOT_FOUND,
      });
    }

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      id: id,
      message: ReasonPhrases.OK,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
});

module.exports = productRouter;
