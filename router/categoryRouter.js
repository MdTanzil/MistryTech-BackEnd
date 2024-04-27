const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const express = require("express");
const { Category } = require("../models");

const categoryRouter = express.Router();

// Get all categories
categoryRouter.get("/", async (req, res) => {
  const perPage = parseInt(req.query.perPage) || 10; // Number of category per page (default is 10)
  const page = parseInt(req.query.page) || 1; // Page number (default is 1)
  try {
    // Find total number of category
    const totalCategory = await Category.countDocuments();

    // Calculate total number of pages
    const totalPages = Math.ceil(totalCategory / perPage);

    // Calculate the starting index of users for the requested page
    const startIndex = (page - 1) * perPage;

    // Query Category for the requested page
    const categries = await Category.find().skip(startIndex).limit(perPage);

    res.status(StatusCodes.OK).json({
      totalPages,
      currentPage: page,
      total: totalCategory,
      categries,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
});

//Create a new category
categoryRouter.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    await category.save();
    res.status(StatusCodes.OK).json(category);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: err.message,
    });
  }
});

//get a specific Category

categoryRouter.get("/:slug", async (req, res) => {
  try {
    const slugUrl = req.params.slug;
    const category = await Category.findOne({ slug: slugUrl });
    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: ReasonPhrases.NOT_FOUND,
      });
    }
    res.status(StatusCodes.OK).json(category);
  } catch (error) {}
});

//update a Category

categoryRouter.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedCategory = req.body;

    const category = await Category.findByIdAndUpdate(id, updatedCategory, {
      new: true,
    });

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

//Delete a Category

categoryRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
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

module.exports = categoryRouter;
