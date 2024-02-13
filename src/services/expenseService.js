const expenseRepository = require("../repositories/expenseRepository");

exports.createExpense = async (data) => {
  let installments = 1;
  let currentInstallment = 1;

  // Supondo que 'CREDIT_CARD' tenha o ID 1 na tabela PaymentMethod
  if (data.paymentMethodId === 1 && data.installments) {
    installments = data.installments;
  }

  if (data.paymentMethodId === 1 && data.currentInstallment) {
    currentInstallment = data.currentInstallment;
  }

  return await expenseRepository.createExpense({
    ...data,
    installments,
    currentInstallment,
  });
};

exports.getById = async (id) => {
  return expenseRepository.getById(id);
};

exports.getAllExpenses = async (month, year, orderBy) => {
  if (month && year) {
    return expenseRepository.getExpenses(month, year, orderBy);
  } else {
    return expenseRepository.getAllExpenses(orderBy);
  }
};

exports.sumExpenses = (expenses) => {
  return expenses.reduce((sum, current) => sum + current.amount, 0);
};

exports.updateExpense = async (id, data) => {
  return expenseRepository.updateExpense(id, data);
};

exports.deleteManyExpenses = async (ids) => {
  return await expenseRepository.deleteManyExpenses(ids);
};
