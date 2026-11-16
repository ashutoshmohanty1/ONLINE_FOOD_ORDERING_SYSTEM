const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {

    try {

        // 1. Get token from cookie
        const token = req.cookies?.token;

        // 2. Check whether token exists
        if (!token) {
            return res.status(401).json({
                message: 'Please login first'
            });
        }

        // 3. Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // 4. Store user information in request
        req.user = decoded;

        // 5. Allow request to continue
        next();

    } catch (error) {

        return res.status(401).json({
            message: 'Invalid or expired token. Please login again.'
        });

    }

}

module.exports = authMiddleware;
