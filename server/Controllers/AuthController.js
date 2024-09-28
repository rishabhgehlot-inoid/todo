const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

module.exports.Signup = async (req, res, next) => {
  const { email, password, username, createdAt } = req.body;
  console.log(email);
  const idV4 = uuidv4();
  console.log("UUIDv4:", idV4);
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
      createdAt,
      token: "",
      userId: idV4,
    });
    const token = createSecretToken(user._id);
    user.token = token;
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(201).json({
      message: "User signed in successfully",
      token,
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      console.log("user no find");

      return res.json({ message: "Incorrect password or email" });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      console.log("auth not found", user, auth);
      return res.json({ message: "Incorrect password or email" });
    }
    const token = createSecretToken(user._id);
    user.token = token;
    user.save();
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User logged in successfully", token, success: true });
  } catch (error) {
    console.error(error);
  }
};

module.exports.Logout = async (req, res, next) => {
  const token = req.headers["token"];
  console.log(token, "token");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decoded.id;
    console.log(userId);
    const user = await User.findById(userId);
    user.token = "";
    user.save();
    res.cookie("token", "", {
      expires: new Date(0),
      httpOnly: false, // Adjust if you want to change this
    });
    res.status(200).json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred during logout" });
  }
};

module.exports.getUser = async (req, res, next) => {
  const token = req.headers["token"];
  console.log(token, "token");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decoded.id;
    console.log(userId);
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
  }
};

module.exports.UpdateUser = async (req, res, next) => {
  const { email, username, password } = req.body;
  const token = req.headers["token"];
  console.log(token, "token");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY); // Adjust according to your secret
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    if (email) user.email = email;
    if (username) user.username = username;
    if (password) {
      user.password = await bcrypt.hash(password, 10); // Hash the new password
    }

    await user.save();

    res
      .status(200)
      .json({ message: "User updated successfully", success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred during the update" });
  }
};
