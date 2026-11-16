
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
} = require("../controllers/cart.controller");

// Add food to cart
router.post("/add", authMiddleware, addToCart);

// Get logged-in user's cart
router.get("/", authMiddleware, getCart);

// Update food quantity
router.put("/update/:foodId", authMiddleware, updateCartItem);

// Remove food from cart
router.delete("/remove/:foodId", authMiddleware, removeCartItem);

// Clear entire cart
router.delete("/clear", authMiddleware, clearCart);

module.exports = router;
