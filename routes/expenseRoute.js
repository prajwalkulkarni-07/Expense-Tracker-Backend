import express from "express";
import {addExpense, deleteExpense, downloadExpenses, getAllExpenses} from "../controllers/expenseController.js";
import protect from "../middleware/authMiddleWare.js";

const router = express.Router();

router.get("/get", protect,getAllExpenses);

router.post("/add", protect,addExpense);

router.get("/downloadexpenses", protect,downloadExpenses);

router.delete("/:id", protect,deleteExpense);

export default router;