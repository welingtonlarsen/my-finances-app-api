const expenseService = require('../services/expenseService');

exports.createExpense = async (req, res) => {
  try {
    const expense = await expenseService.createExpense(req.body);
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const { month, year } = req.query;
    const allExpenses = await expenseService.getAllExpenses(month, year)
    const total = expenseService.sumExpenses(allExpenses)
    res.status(200).json({
      expenses: allExpenses,
      total
    })
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}