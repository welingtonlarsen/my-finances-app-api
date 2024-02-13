const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");

router.post("/", expenseController.createExpense);
router.get("/", expenseController.getAllExpenses);
router.delete("/", expenseController.deleteManyExpenses);

module.exports = router;
