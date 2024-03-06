const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");

router.get("/summary", expenseController.getSummaryOfExpenses);
router.post("/", expenseController.createExpense);
router.get("/", expenseController.getAllExpenses);
router.get("/:id", expenseController.getById);
router.patch("/:id", expenseController.updateExpense);
router.delete("/", expenseController.deleteManyExpenses);


module.exports = router;
