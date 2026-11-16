const userModel = require("../model/user.model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//register controller
async function userRegister(req, res){
    try {
        const { username, email, phone, password } = req.body;

        // check existing user
        const isUserAlreadyExist = await userModel.findOne({
            $or: [
                {email},
                {phone}
            ]
        });

        if(isUserAlreadyExist) {
            return res.status(409).json({
                message: "User already exists"
            })
        }

        // hash password
        const hash = await bcrypt.hash(password, 10);

        // create user
        const user = await userModel.create({ 
            username, 
            email, 
            phone, 
            password: hash,
        });

        //generate jwt
        const token = jwt.sign(
            {
                id: user._id,
            }, 
            process.env.JWT_SECRET,
            {
                expiresIn: '6h',
            }
        );

        //store jwt in cookie
        res.cookie("token", token, {
            httpOnly: true,     //  httpOnly: JavaScript running in the browser cannot access the cookie.
            secure: process.env.NODE_ENV === "production",    //  secure: Sends cookies only over HTTPS in production.
            sameSite: "lax",    //  sameSite: Helps protect against CSRF attacks.
            maxAge: 6 * 60 * 60 * 1000,    //  maxAge: Cookie expires after 6 hours.
        });

        //  send response
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
            }
        });

    } catch(error) {
        console.error("User register failed: ", error);
        res.status(500).json({
            message: "Register failed"
        });
    }
};

// login controller
async function userLogin(req, res) {
    try {
        const { email, phone, password } = req.body;

        //Find user
        const user = await userModel.findOne({
            $or: [
                { email },
                { phone }
            ]
        });

        if(!user) {
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        };

        //  compare password
        const isPasswordValid = await bcrypt.compare(
            password, user.password
        );

        if(!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        };

        //  generate jwt
        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '6h'
            }
        );

        //store jwt in cookie
        res.cookie("token", token, {
            httpOnly: true,     //  httpOnly: JavaScript running in the browser cannot access the cookie.
            secure: process.env.NODE_ENV === "production",    //  secure: Sends cookies only over HTTPS in production.
            sameSite: "lax",    //  sameSite: Helps protect against CSRF attacks.
            maxAge: 6 * 60 * 60 * 1000,    //  maxAge: Cookie expires after 6 hours.
        });

        // send response
        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
            }
        });

    } catch(error) {
        console.error("User login failed:", error);

        return res.status(500).json({
            message: "Login failed"
        });
    }
};

// get user profile
async function getUserProfile(req, res) {

    try {

        // Get logged-in user's ID from middleware
        const userId = req.user.id;

        // Find user in MongoDB
        const user = await userModel
            .findById(userId)
            .select("-password");

        // Check whether user exists
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Send user profile
        return res.status(200).json({
            message: "Profile fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                createdAt: user.createdAt
            }
        });

    } catch (error) {

        console.error("Get profile failed:", error);

        return res.status(500).json({
            message: "Failed to fetch profile"
        });

    }

};

// user logout

async function userLogout(req, res) {

    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        return res.status(200).json({
            message: "User logged out successfully"
        });

    } catch (error) {

        console.error("Logout failed:", error);

        return res.status(500).json({
            message: "Logout failed"
        });

    }

}




module.exports = {
    userRegister,
    userLogin,
    getUserProfile,
    userLogout
};