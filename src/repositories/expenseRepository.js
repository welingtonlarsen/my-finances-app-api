const { PrismaClient } = require("@prisma/client");
const { startOfMonth, endOfMonth, parse } = require("date-fns");

const prisma = new PrismaClient();

exports.createExpense = async (data) => {
  const isoDate = new Date(data.date);
  return await prisma.expense.create({
    data: {
      ...data,
      date: isoDate,
    },
  });
};

exports.getAllExpenses = async () => {
  return prisma.expense.findMany({
    include: {
      category: true, // Inclui os dados da categoria
      paymentMethod: true, // Inclui os dados do método de pagamento
    },
    orderBy: {
      date: "desc",
    },
  });
};

exports.getExpenses = async (month, year) => {
  const startDate = startOfMonth(
    parse(`${month} ${year}`, "MMMM yyyy", new Date())
  );
  const endDate = endOfMonth(startDate);

  const x = await prisma.expense.findMany({
    where: {
      AND: [{ date: { gte: startDate } }, { date: { lt: endDate } }],
    },
    include: {
      category: true, // Inclui os dados da categoria
      paymentMethod: true, // Inclui os dados do método de pagamento
    },
  });
};

exports.deleteManyExpenses = async (ids) => {
  return await prisma.expense.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};
