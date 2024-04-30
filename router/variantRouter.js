const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { Category, Product, User, Variant } = require("../models");
const { fileUpload } = require("../config");
const express = require("express");

const variantRouter = express.Router();
// status code import

// get product
variantRouter.get("/", async (req, res) => {
  const perPage = parseInt(req.query.perPage) || 10;
  // Number of variant per page (default is 10)
  const page = parseInt(req.query.page) || 1; // Page number (default is 1)
  try {
    // Find total number of variants
    const totalVariant = await Variant.countDocuments();

    // Calculate total number of pages
    const totalPages = Math.ceil(totalVariant / perPage);

    // Calculate the starting index of variant for the requested page
    const startIndex = (page - 1) * perPage;

    // Query variant for the requested page
    const variant = await Variant.find().skip(startIndex).limit(perPage);

    res.status(StatusCodes.OK).json({
      totalPages,
      currentPage: page,
      total: totalVariant,
      variant,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
});

//Add a variant
variantRouter.post("/", fileUpload.array("images", 5), async (req, res) => {
  try {
    const variant = new Variant(req.body);
    if (req.files && req.files.length > 0) {
      variant.images = req.files.map((file) => file.path);
    }
    await variant.save();
    res.status(StatusCodes.OK).json(variant);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: error.message,
    });
  }
});

//get a specific user

variantRouter.get("/:id", async (req, res) => {
  try {
    const variant = await Variant.findById(req.params.id);
    if (!variant) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: ReasonPhrases.NOT_FOUND,
      });
    }
    res.status(StatusCodes.OK).json(variant);
  } catch (error) {
    console.log("call");

    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
});

//update a product

variantRouter.put("/:id", (req, res) => {
  const id = req.params.id;
  const variant = req.body;

  // const updateQuery = { $set: variant };

  Variant.findByIdAndUpdate(id, variant, { new: true })
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

variantRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deletedVariant = await Variant.findByIdAndDelete(id);

    if (!deletedVariant) {
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

module.exports = variantRouter;
