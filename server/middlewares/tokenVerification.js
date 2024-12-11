const jwt = require('jsonwebtoken');

const tokenValidator = (req, res, next) => {
   const token = req.headers.authorization?.split(' ')[1]; // Extract token from Bearer header

   if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
   }

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach decoded user data to the request
      next();
   } catch (err) {
      res.status(403).json({ success: false, message: 'Invalid or expired token.' });
   }
};

module.exports = { tokenValidator };
