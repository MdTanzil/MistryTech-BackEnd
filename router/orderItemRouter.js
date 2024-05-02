const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { OrderItem } = require("../models");

const express = require("express");

const orderItemRouter = express.Router();
// status code import

// get product
orderItemRouter.get("/", async (req, res) => {
  const perPage = parseInt(req.query.perPage) || 10;
  // Number of data per page (default is 10)
  const page = parseInt(req.query.page) || 1; // Page number (default is 1)
  try {
    // Find total number of Item
    const totalOrderItem = await OrderItem.countDocuments();

    // Calculate total number of pages
    const totalPages = Math.ceil(totalOrderItem / perPage);

    // Calculate the starting index of variant for the requested page
    const startIndex = (page - 1) * perPage;

    // Query variant for the requested page
    const orderItem = await OrderItem.find()
      .sort({ createdAt: "desc" })
      .skip(startIndex)
      .limit(perPage)
      .populate("product")
      .populate("variant")
      .exec();

    res.status(StatusCodes.OK).json({
      totalPages,
      currentPage: page,
      total: totalOrderItem,
      orderItem,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
});

//Add a order item
orderItemRouter.post("/", async (req, res) => {
  try {
    const orderItem = new OrderItem(req.body);
    await orderItem.save();
    res.status(StatusCodes.OK).json(orderItem);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: error.message,
    });
  }
});

//get a specific order item

orderItemRouter.get("/:id", async (req, res) => {
  try {
    const orderItem = await OrderItem.findById(req.params.id)
      .populate("product")
      .populate("variant")
      .exec();

    if (!orderItem) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: ReasonPhrases.NOT_FOUND,
      });
    }
    res.status(StatusCodes.OK).json(orderItem);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
});

//update a order item

orderItemRouter.put("/:id", (req, res) => {
  const id = req.params.id;
  const orderItem = req.body;

  // const updateQuery = { $set: variant };

  OrderItem.findByIdAndUpdate(id, orderItem, { new: true })
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

orderItemRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deletedOrderItem = await OrderItem.findByIdAndDelete(id);

    if (!deletedOrderItem) {
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

module.exports = orderItemRouter;
