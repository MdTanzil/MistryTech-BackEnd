const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const express = require("express");
const { SubCategory } = require("../models");
const mongoose = require("mongoose");
require("dotenv").config();
const subCategoryRouter = express.Router();
// Get all subCategories
subCategoryRouter.get("/", async (req, res) => {
  const perPage = parseInt(req.query.perPage) || 10; // Number of category per page (default is 10)
  const page = parseInt(req.query.page) || 1; // Page number (default is 1)
  try {
    // Find total number of category
    const totalSubCategory = await SubCategory.countDocuments();

    // Calculate total number of pages
    const totalPages = Math.ceil(totalSubCategory / perPage);

    // Calculate the starting index of users for the requested page
    const startIndex = (page - 1) * perPage;

    // Query SubCategory for the requested page
    const subCategories = await SubCategory.find()
      .sort({ createdAt: "desc" })
      .populate("category")
      .skip(startIndex)
      .limit(perPage);

    res.status(StatusCodes.OK).json({
      totalPages,
      currentPage: page,
      total: totalSubCategory,
      subCategories: subCategories,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
});

//Create a new category
subCategoryRouter.post("/", async (req, res) => {
  try {
    const category = new SubCategory(req.body);

    await category.save();

    res.status(StatusCodes.OK).json(category);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: err.message,
    });
  }
});

//get a specific SubCategory

subCategoryRouter.get("/:slugOrId", async (req, res) => {
  try {
    const slugOrId = req.params.slugOrId;
    let category;

    // Check if slugOrId is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      // If it's a valid ObjectId, search by id
      category = await SubCategory.findById(slugOrId).populate("category");
    } else {
      // If it's not a valid ObjectId, search by slug
      category = await SubCategory.findOne({ slug: slugOrId }).populate(
        "category"
      );
    }

    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: ReasonPhrases.NOT_FOUND,
      });
    }

    return res.status(StatusCodes.OK).json(category.toObject());
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
});

//update a SubCategory

subCategoryRouter.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedSubCategory = req.body;

    const category = await SubCategory.findByIdAndUpdate(
      id,
      updatedSubCategory,
      {
        new: true,
      }
    );

    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: ReasonPhrases.NOT_FOUND,
      });
    }

    res.status(StatusCodes.OK).json(category);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
});

//Delete a SubCategory

subCategoryRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deletedSubCategory = await SubCategory.findByIdAndDelete(id);

    if (!deletedSubCategory) {
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

module.exports = subCategoryRouter;
