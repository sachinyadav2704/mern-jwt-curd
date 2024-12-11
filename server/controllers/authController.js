const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User');

// Utility function for error responses
const handleError = (res, message, statusCode = 500) => {
   return res.status(statusCode).json({
      success: false,
      message,
   });
};

// Utility function for success responses
const handleSuccess = (res, message, data = {}, statusCode = 200) => {
   return res.status(statusCode).json({
      success: true,
      message,
      data,
   });
};

// Signup function with enhanced validation and error handling
const signup = async (req, res) => {
   const { name, email, password } = req.body;

   // Validate input
   if (!name || !email || !password) {
      return handleError(res, 'All fields are required', 400);
   }

   // Check if the user already exists
   const userExists = await UserModel.findOne({ email });
   if (userExists) {
      return handleError(res, 'User already exists, please login', 409);
   }

   try {
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserModel({ name, email, password: hashedPassword });
      await newUser.save();

      // Return success response
      handleSuccess(res, 'Signup successful', { name, email });
   } catch (error) {
      console.error('Signup error:', error);
      handleError(res, 'Internal server error');
   }
};

// Login function with improved token handling and error responses
const login = async (req, res) => {
   const { email, password } = req.body;

   // Validate input
   if (!email || !password) {
      return handleError(res, 'Email and password are required', 400);
   }

   try {
      const user = await UserModel.findOne({ email });

      // Check if user exists
      if (!user) {
         return handleError(res, 'Invalid email or password', 403);
      }

      // Check if password matches
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
         return handleError(res, 'Invalid email or password', 403);
      }

      // Generate JWT token
      const jwtToken = jwt.sign(
         { email: user.email, _id: user._id },
         process.env.JWT_SECRET,
         { expiresIn: '24h' } // Token expiry time
      );

      // Return success response with JWT token and user details
      handleSuccess(res, 'Login successful', { jwtToken, name: user.name, email: user.email });
   } catch (error) {
      console.error('Login error:', error);
      handleError(res, 'Internal server error');
   }
};

module.exports = {
   signup,
   login,
};
