
const Address = require("../model/address.model");


// =====================================
// ADD NEW ADDRESS
// =====================================

exports.addAddress = async (req, res) => {
    try {
        const {
            fullName,
            phone,
            addressLine,
            city,
            state,
            pincode
        } = req.body;

        if (
            !fullName ||
            !phone ||
            !addressLine ||
            !city ||
            !state ||
            !pincode
        ) {
            return res.status(400).json({
                success: false,
                message: "All address fields are required"
            });
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid 10-digit phone number"
            });
        }

        if (!/^[0-9]{6}$/.test(pincode)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid 6-digit PIN code"
            });
        }

        const addressCount = await Address.countDocuments({
            user: req.user.id
        });

        const address = await Address.create({
            user: req.user.id,
            fullName,
            phone,
            addressLine,
            city,
            state,
            pincode,
            isDefault: addressCount === 0
        });

        return res.status(201).json({
            success: true,
            message: "Address saved successfully",
            address
        });

    } catch (error) {
        console.error("Add address error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save address"
        });
    }
};


// =====================================
// GET USER ADDRESSES
// =====================================

exports.getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({
            user: req.user.id
        }).sort({ isDefault: -1, createdAt: -1 });

        return res.status(200).json({
            success: true,
            addresses
        });

    } catch (error) {
        console.error("Get addresses error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch addresses"
        });
    }
};


// =====================================
// SET DEFAULT ADDRESS
// =====================================

exports.setDefaultAddress = async (req, res) => {
    try {
        const address = await Address.findOne({
            _id: req.params.addressId,
            user: req.user.id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        await Address.updateMany(
            { user: req.user.id },
            { $set: { isDefault: false } }
        );

        address.isDefault = true;

        await address.save();

        return res.status(200).json({
            success: true,
            message: "Default address updated",
            address
        });

    } catch (error) {
        console.error("Set default address error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update default address"
        });
    }
};


// =====================================
// DELETE ADDRESS
// =====================================

exports.deleteAddress = async (req, res) => {
    try {
        const address = await Address.findOneAndDelete({
            _id: req.params.addressId,
            user: req.user.id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        // If deleted address was default, choose another
        if (address.isDefault) {
            const nextAddress = await Address.findOne({
                user: req.user.id
            }).sort({ createdAt: -1 });

            if (nextAddress) {
                nextAddress.isDefault = true;
                await nextAddress.save();
            }
        }

        return res.status(200).json({
            success: true,
            message: "Address deleted successfully"
        });

    } catch (error) {
        console.error("Delete address error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete address"
        });
    }
};
