import jwt from "jsonwebtoken";
import express from "express";
import User from "../models/User.js";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const registerUser = async (req, res) => {
  const { fullName, email, password, profileImageURL } = req.body;
  //   console.log(req);

  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please fill in all the required details" });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists. Please log in." });
    }

    const newUser = await User.create({
      fullName,
      email,
      password,
      profileImageURL,
    });

    res
      .status(201)
      .json({ id: newUser._id, newUser, token: generateToken(newUser._id) });
  } catch (err) {
    // console.error(`Error message: ${err.message}`);
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please enter all the details required" });
  }

  try {
    const user = await User.findOne({ email }); // also make sure you're importing User here
    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist. Please register first" });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid password" });
    } else {
      return res
        .status(200)
        .json({ id: user._id, user, token: generateToken(user._id) });
    }
  } catch (err) {
    res.status(500).json({ message: "Unable to login", error: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist. Please register first" });
    }

    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Unable to fetch user", error: err.message });
  }
};
