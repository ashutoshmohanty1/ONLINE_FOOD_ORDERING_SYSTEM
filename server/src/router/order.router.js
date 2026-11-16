
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
    placeOrder,
    getMyOrders
} = require("../controllers/order.controller");

// Place new order
router.post("/place", authMiddleware, placeOrder);

// Get logged-in user's orders
router.get("/my-orders", authMiddleware, getMyOrders);

module.exports = router;
