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

exports.getAllExpenses = async (month, year) => {
  if (month && year) {
    return expenseRepository.getExpenses(month, year);
  } else {
    return expenseRepository.getAllExpenses();
  }
};

exports.sumExpenses = (expenses) => {
  return expenses.reduce((sum, current) => sum + current.amount, 0);
};
