
const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token' });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Authentication token is required' });
    }
};

exports.authorizeStudent = (req, res, next) => {
    if (req.user && req.user.user_type === 'student') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Students only.' });
    }
};

exports.authorizeTeacher = (req, res, next) => {
    if (req.user && req.user.user_type === 'teacher') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Teachers only.' });
    }
};
