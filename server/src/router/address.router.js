
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
    addAddress,
    getAddresses,
    setDefaultAddress,
    deleteAddress
} = require("../controllers/address.controller");

// Add address
router.post("/add", authMiddleware, addAddress);

// Get logged-in user's addresses
router.get("/", authMiddleware, getAddresses);

// Set default address
router.put("/default/:addressId", authMiddleware, setDefaultAddress);

// Delete address
router.delete("/:addressId", authMiddleware, deleteAddress);

module.exports = router;
