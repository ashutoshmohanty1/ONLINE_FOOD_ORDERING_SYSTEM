const Cart = require("../model/cart.model");

// ADD FOOD TO CART
exports.addToCart = async (req, res) => {
    try {
        const { foodId, name, price, image, quantity = 1 } = req.body;

        if (!foodId || !name || price == null || !image) {
            return res.status(400).json({
                success: false,
                message: "All food details are required"
            });
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive integer"
            });
        }

        if (!Number.isFinite(price) || price < 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid food price"
            });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = new Cart({
                user: req.user.id,
                items: []
            });
        }

        const existingItem = cart.items.find(
            item => item.foodId === Number(foodId)
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                foodId: Number(foodId),
                name,
                price,
                image,
                quantity
            });
        }

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Food added to cart",
            cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET USER CART
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user.id
        });

        res.status(200).json({
            success: true,
            cart: cart || { items: [] }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE FOOD QUANTITY
exports.updateCartItem = async (req, res) => {
    try {
        const foodId = Number(req.params.foodId);
        const { quantity } = req.body;

        if (!Number.isInteger(foodId) || !Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid food ID or quantity"
            });
        }

        const cart = await Cart.findOne({
            user: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const item = cart.items.find(
            item => item.foodId === foodId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Food item not found in cart"
            });
        }

        item.quantity = quantity;

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated",
            cart
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// REMOVE FOOD FROM CART
exports.removeCartItem = async (req, res) => {
    try {
        const foodId = Number(req.params.foodId);

        const cart = await Cart.findOne({
            user: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            item => item.foodId !== foodId
        );

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Food removed from cart",
            cart
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// CLEAR ENTIRE CART
exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = [];

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            cart
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};