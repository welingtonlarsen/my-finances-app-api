const { PrismaClient } = require('@prisma/client');
const { startOfMonth, endOfMonth, parse } = require('date-fns');

const prisma = new PrismaClient();

exports.createExpense = async (data) => {
  const isoDate = new Date(data.date);
  return await prisma.expense.create({data: {
      ...data,
      date: isoDate,
    }
  });
};

exports.getAllExpenses = async () => {
  return prisma.expense.findMany()
}

exports.getExpenses = async (month, year) => {
  const startDate = startOfMonth(parse(`${month} ${year}`, 'MMMM yyyy', new Date()));
  const endDate = endOfMonth(startDate);

  return await prisma.expense.findMany({
    where: {
      AND: [
        { date: { gte: startDate } },
        { date: { lt: endDate } }
      ]
    },
  });
}