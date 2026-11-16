
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        orderNumber: {
            type: String,
            required: true,
            unique: true
        },

        items: [
            {
                foodId: {
                    type: Number,
                    required: true
                },

                name: {
                    type: String,
                    required: true
                },

                price: {
                    type: Number,
                    required: true
                },

                image: {
                    type: String,
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                }
            }
        ],

        deliveryAddress: {
            fullName: {
                type: String,
                required: true
            },

            phone: {
                type: String,
                required: true
            },

            addressLine: {
                type: String,
                required: true
            },

            city: {
                type: String,
                required: true
            },

            state: {
                type: String,
                required: true
            },

            pincode: {
                type: String,
                required: true
            }
        },

        subtotal: {
            type: Number,
            required: true
        },

        deliveryFee: {
            type: Number,
            default: 40
        },

        tax: {
            type: Number,
            required: true
        },

        grandTotal: {
            type: Number,
            required: true
        },

        paymentMethod: {
            type: String,
            enum: ["cod"],
            default: "cod"
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid"],
            default: "pending"
        },

        orderStatus: {
            type: String,
            enum: [
                "confirmed",
                "preparing",
                "out_for_delivery",
                "delivered",
                "cancelled"
            ],
            default: "confirmed"
        },

        estimatedDeliveryAt: {
            type: Date,
            required: true
        }

    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
