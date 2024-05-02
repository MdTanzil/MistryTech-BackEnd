const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { OrderItem, Order } = require("../models");

const express = require("express");

const orderRouter = express.Router();
// status code import

// get product
orderRouter.get("/", async (req, res) => {
  const perPage = parseInt(req.query.perPage) || 10;
  // Number of data per page (default is 10)
  const page = parseInt(req.query.page) || 1; // Page number (default is 1)
  try {
    // Find total number of Item
    const totalOrder = await Order.countDocuments();

    // Calculate total number of pages
    const totalPages = Math.ceil(totalOrder / perPage);

    // Calculate the starting index of variant for the requested page
    const startIndex = (page - 1) * perPage;

    // Query variant for the requested page
    const order = await Order.find()
      .sort({ createdAt: "desc" })
      .skip(startIndex)
      .limit(perPage)
      .populate({
        path: "orderItem",
        populate: {
          path: "product variant",
        },
      })
      .exec();

    res.status(StatusCodes.OK).json({
      totalPages,
      currentPage: page,
      total: totalOrder,
      order,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
});

//Add a order item
orderRouter.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(StatusCodes.OK).json(order);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: error.message,
    });
  }
});

//get a specific order item

orderRouter.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: "orderItem",
        populate: {
          path: "product variant",
        },
      })
      .exec();

    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: ReasonPhrases.NOT_FOUND,
      });
    }
    res.status(StatusCodes.OK).json(order);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
});

//update a order item

orderRouter.put("/:id", (req, res) => {
  const id = req.params.id;
  const order = req.body;

  // const updateQuery = { $set: variant };

  Order.findByIdAndUpdate(id, order, { new: true })
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

//Delete a order item

orderRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
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

module.exports = orderRouter;
