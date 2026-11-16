
const crypto = require("crypto");

const Order = require("../model/order.model");
const Cart = require("../model/cart.model");
const Address = require("../model/address.model");


// =====================================
// 1. PLACE ORDER
// =====================================

exports.placeOrder = async (req, res) => {
    try {

        const userId = req.user.id;
        const { addressId } = req.body;

        // Check address ID
        if (!addressId) {
            return res.status(400).json({
                success: false,
                message: "Please select a delivery address"
            });
        }

        // Find address belonging to logged-in user
        const address = await Address.findOne({
            _id: addressId,
            user: userId
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Delivery address not found"
            });
        }

        // Get logged-in user's cart
        const cart = await Cart.findOne({
            user: userId
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty"
            });
        }

        // Calculate order totals on backend
        const items = cart.items.map(item => ({
            foodId: item.foodId,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity
        }));

        const subtotal = items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        const deliveryFee = 40;
        const tax = Number((subtotal * 0.05).toFixed(2));

        const grandTotal = Number(
            (subtotal + deliveryFee + tax).toFixed(2)
        );

        // Generate order number
        const orderNumber =
            "FD" + Date.now() + crypto.randomInt(100, 1000);

        // Estimated delivery: 20 minutes
        const estimatedDeliveryAt = new Date(
            Date.now() + 20 * 60 * 1000
        );

        // Create order
        const order = await Order.create({

            user: userId,

            orderNumber,

            items,

            deliveryAddress: {
                fullName: address.fullName,
                phone: address.phone,
                addressLine: address.addressLine,
                city: address.city,
                state: address.state,
                pincode: address.pincode
            },

            subtotal,
            deliveryFee,
            tax,
            grandTotal,

            paymentMethod: "cod",
            paymentStatus: "pending",
            orderStatus: "confirmed",

            estimatedDeliveryAt

        });

        // Clear cart only after successful order creation
        cart.items = [];
        await cart.save();

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });

    } catch (error) {

        console.error("Place order error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to place order"
        });

    }
};


// =====================================
// 2. GET MY ORDERS
// =====================================

exports.getMyOrders = async (req, res) => {
    try {

        const orders = await Order.find({
            user: req.user.id
        }).sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {

        console.error("Get orders error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        });

    }
};
