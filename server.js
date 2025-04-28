import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import incomeRoute from "./routes/incomeRoute.js";
import expensesRoute from "./routes/expenseRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Middle ware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

// Add this before your routes in server.js
// app.use((req, res, next) => {
//   console.log("Body:", req.body);
//   next();
// });

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/income", incomeRoute);
app.use("/api/v1/expenses", expensesRoute);
app.use("/api/v1/dashboard", dashboardRoute);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
