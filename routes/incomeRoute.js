import express from "express";
import {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadexcel,
} from "../controllers/incomeController.js";
import protect from "../middleware/authMiddleWare.js";

const router = express.Router();

router.post("/add", protect, addIncome);

router.get("/get", protect, getAllIncome);

router.get("/downloadexcel", protect, downloadexcel);

router.delete("/:id", protect, deleteIncome);

export default router;
