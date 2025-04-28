import express from "express";
import protect from "../middleware/authMiddleWare.js";
import {
  registerUser,
  loginUser,
  getUser,
} from "../controllers/authController.js";
import upload from "../middleware/uploadMiddleWare.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/getUser", protect, getUser);

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageURL = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;

  res.status(200).json({ imageURL });
});

export default router;
