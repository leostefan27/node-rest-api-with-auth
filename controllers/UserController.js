const User = require("../models/User");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

// @desc Get current user
// @route GET request to /users/me
// @privacy Private

const getCurrentUser = asyncHandler(async (req, res) => {
  const data = await User.findById(req.user._id).lean();

  if (!data) {
    res.status(400).json({ message: "User not found!" });
    return;
  }

  res.status(200).json(data);
});

// @desc Create a new user
// @route POST request to /users/register
// @privacy Public
const createUser = asyncHandler(async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(req.body.password, salt);
  const sessionDuration = new Date(Date.now() + 3600000 * 24);
  const session_token = uuidv4();

  // Check if the user already exists
  const emailExists = await User.findOne({ email: req.body.email });
  const usernameExists = await User.findOne({ username: req.body.username });

  if (emailExists) {
    res.status(400).json({ message: "Email already exists" });
    return;
  }

  if (usernameExists) {
    res.status(400).json({ message: "Username already exists" });
    return;
  }

  // Check if all the fields are completed
  if (!req.body.email || !req.body.username || !req.body.password) {
    res.status(400).json({ message: "Please complete all the fields" });
    return;
  }

  // Store the user to db
  try {
    const user = await User.create({
      email: req.body.email,
      username: req.body.username,
      password: encryptedPassword,
      profile_picture: "default",
      session_token: session_token,
    });

    // Set session cookie
    res.cookie("session_token", session_token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      expires: sessionDuration,
    });

    res.status(200).json({
      email: user.email,
      username: user.username,
      password: user.password,
      profile_picture: user.profile_picture,
      _token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc Log in with an existing user
// @route POST request to /users/login
// @privacy Public
const loginUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).lean();
  const session_token = uuidv4();

  // Check if the user exists
  if (!user) {
    res.status(400).json({ message: "User doesn't exist" });
    return;
  }

  // Log in the user
  try {
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      const sessionDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      const expires = new Date(Date.now() + sessionDuration);

      res.cookie("session_token", session_token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires,
        domain: "localhost",
        path: "/",
      });

      await User.findByIdAndUpdate(
        user._id,
        { session_token: session_token },
        { new: true }
      );

      res.status(200).json({
        email: user.email,
        username: user.username,
        profile_picture: user.profile_picture,
        articles: user.articles,
        _token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Email or password incorrect" });
      return;
    }
  } catch (error) {
    console.error(error);
  }

  // The res.cookie function call should be placed inside the function body
});

// @desc Logout current user by clearing the httpOnly session_token cookie
// @route POST request to /users/logout
// @privacy Public
const logoutUser = asyncHandler((req, res) => {
  try {
    res.clearCookie("session_token", { httpOnly: true });
    res.status(200).json({ message: "User logged out" });
  } catch (error) {
    console.error(error);
  }
});

// @desc Update an existing user
// @route POST request to /users/edit/:id
// @privacy Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  // Check if the user exists
  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }
  // Update user
  try {
    await User.findByIdAndUpdate(req.params.id, req.body, { new: false });
    res.status(200).json({ message: "User updated" });
  } catch (error) {
    console.error(error);
  }
});

// @desc Delete an existing user
// @route POST request to /users/delete/:id
// @privacy Private
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  // Check if the user exists
  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }
  // Delete user
  try {
    await user.remove();
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
  }
});

// desc Function that generates an jwt token that contains the user _id
// generateToken(id: any)
// returns jwt token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
module.exports = {
  getCurrentUser,
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
};
