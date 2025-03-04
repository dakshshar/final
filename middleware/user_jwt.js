const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({
            msg: 'No token, authorization denied'
        });
    }

    try {
        jwt.verify(token, process.env.JWT_USER_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    msg: 'Token not valid'
                });
            }
            req.user = decoded.user;
            next(); // Move to the next middleware or route
        });
    } catch (err) {
        console.error('Something went wrong with middleware:', err);
        res.status(500).json({
            msg: 'Server error'
        });
    }
};
