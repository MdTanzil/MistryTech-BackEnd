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
productRouter.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
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

productRouter.put("/:id", (req, res) => {
  const id = req.params.id;
  const product = req.body;
  Product.findByIdAndUpdate(id, product, { new: true })
    .then((doc) => {
      res.status(StatusCodes.OK).json(doc);
    })
    .catch((err) => {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: ReasonPhrases.BAD_REQUEST,
      });
    });
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
