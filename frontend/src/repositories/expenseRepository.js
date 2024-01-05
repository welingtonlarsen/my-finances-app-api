const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.createExpense = async (data) => {
  const isoDate = new Date(data.date);
  return await prisma.expense.create({data: {
      ...data,
      date: isoDate,
    }
  });
};