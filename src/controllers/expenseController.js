const expenseService = require("../services/expenseService");

exports.createExpense = async (req, res) => {
  try {
    const expense = await expenseService.createExpense(req.body);
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await expenseService.getById(id);
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    console.log("getall");
    const { month, year, orderBy } = req.query;
    const allExpenses = await expenseService.getAllExpenses(
      month,
      year,
      orderBy
    );
    const total = expenseService.sumExpenses(allExpenses);
    res.status(200).json({
      expenses: allExpenses,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await expenseService.updateExpense(id, req.body);
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteManyExpenses = async (req, res) => {
  try {
    const { ids } = req.body;
    await expenseService.deleteManyExpenses(ids);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
