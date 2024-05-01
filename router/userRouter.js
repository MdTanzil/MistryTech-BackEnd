const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const express = require("express");
const { User } = require("../models");

const userRouter = express.Router();
// status code import

// get users
userRouter.get("/", async (req, res) => {
  const perPage = parseInt(req.query.perPage) || 10;
  // Number of users per page (default is 10)
  const page = parseInt(req.query.page) || 1; // Page number (default is 1)
  try {
    // Find total number of users
    const totalUsers = await User.countDocuments();

    // Calculate total number of pages
    const totalPages = Math.ceil(totalUsers / perPage);

    // Calculate the starting index of users for the requested page
    const startIndex = (page - 1) * perPage;

    // Query users for the requested page
    const users = await User.find().skip(startIndex).limit(perPage);

    res.status(StatusCodes.OK).json({
      totalPages,
      currentPage: page,
      total: totalUsers,
      users,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
});

//Add a User
userRouter.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // User already exists
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "User already exists",
      });
    }

    // Create a new user
    const user = new User(req.body);
    const newUser = await user.save();

    // Return the newly created user
    res.status(StatusCodes.OK).json(newUser);
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
});
//get a specific user

userRouter.get("/:id", (req, res) => {
  const id = req.params.id;
  User.findById(id)
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

//update a user

userRouter.put("/:id", (req, res) => {
  const id = req.params.id;
  const user = req.body;
  User.findByIdAndUpdate(id, user, { new: true })
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

//Delete a User

userRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
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

module.exports = userRouter;
