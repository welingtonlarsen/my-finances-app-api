const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");

router.post("/", expenseController.createExpense);
router.get("/:id", expenseController.getById);
router.get("/", expenseController.getAllExpenses);
router.patch("/:id", expenseController.updateExpense);
router.delete("/", expenseController.deleteManyExpenses);

module.exports = router;
