import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
import { isValidObjectId, Types } from "mongoose";
import express from "express";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    // Fetch total income and expenses
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // console.log("total income", {
    //   totalIncome,
    //   userId: isValidObjectId(userId),
    // });

    const totalExpenses = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    //Get income transactions of last 60 days
    const lastSixtyDaysIncomeTransactions = await Income.find({
      userId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    // Get total income of last 60 days
    const lastSixtyDaysIncome = lastSixtyDaysIncomeTransactions.reduce(
      (sum, transaction) => {
        sum + transaction.amount, 0;
      }
    );

    // Get expense transactions for the last 30 days
    const lastThirtyDatysExpenseTransactions = await Expense.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    //Get total expenses of the last 30 days
    const lastThirtyDaysExpense = lastThirtyDatysExpenseTransactions.reduce(
      (sum, transaction) => {
        sum + transaction.amount, 0;
      }
    );

    // Fetch last 5 transactions (income + expenses)
    const lastFiveTransactions = [
      ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => {
          return { ...txn.toObject(), type: "income" };
        }
      ),
      ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => {
          return { ...txn.toObject(), type: "expense" };
        }
      ),
    ].sort((a, b) => b.date - a.date);

    // Final response
    res.json({
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpenses: totalExpenses[0]?.total || 0,
      last30DayExpenses: {
        total: lastThirtyDaysExpense,
        transactions: lastThirtyDatysExpenseTransactions,
      },
      last60DaysIncome: {
        total: lastSixtyDaysIncome,
        transactions: lastSixtyDaysIncomeTransactions,
      },
      recentTransactions: lastFiveTransactions,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
