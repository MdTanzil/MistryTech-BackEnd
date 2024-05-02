const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const express = require("express");
const { Category } = require("../models");
const { fileUpload } = require("../config");

require("dotenv").config();
const categoryRouter = express.Router();
const serverAddress = process.env.SERVER_ADDRESS || "http://localhost:3000";
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
    const categories = await Category.find()
      .sort({ createdAt: "desc" })
      .skip(startIndex)
      .limit(perPage);

    // Update image URLs for all categories
    const categoriesWithImageUrl = categories.map((category) => {
      if (category.imagePath) {
        const fullImageUrl =
          req.protocol + "://" + req.get("host") + category.imagePath;
        return { ...category.toObject(), imageUrl: fullImageUrl };
      } else {
        return category.toObject();
      }
    });
    res.status(StatusCodes.OK).json({
      totalPages,
      currentPage: page,
      total: totalCategory,
      categories: categoriesWithImageUrl,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
});

//Create a new category
categoryRouter.post("/", fileUpload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = new Category({
      name,
      description,
      imagePath: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

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
    // Check if imagePath exists
    if (category.imagePath) {
      const fullImageUrl =
        req.protocol + "://" + req.get("host") + category.imagePath;
      // Create a new object with imageUrl added
      const categoryWithImageUrl = {
        ...category.toObject(), // Convert Mongoose document to plain JavaScript object
        imageUrl: fullImageUrl,
      };
      return res.status(StatusCodes.OK).json(categoryWithImageUrl);
    } else {
      // Send category without imageUrl
      return res.status(StatusCodes.OK).json(category.toObject());
    }
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
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
