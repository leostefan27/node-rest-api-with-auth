const User = require("../models/User");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    // Check if the user has an existin authorization header
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // Decode jwt
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      // Check if the cookie session_token is equal to the user session_token
      if (req.cookies.session_token == user.session_token) {
        req.user = user;
        next();
      } else {
        res.status(401).json({ message: "User not allowed" });
        return;
      }
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Access not allowed" });
    }
  }

  if (!token) {
    res.status(400).json({ message: "Access Token not found" });
  }
});

module.exports = protect;
