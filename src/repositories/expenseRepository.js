const { PrismaClient } = require("@prisma/client");
const { startOfMonth, endOfMonth, parse } = require("date-fns");

const prisma = new PrismaClient();

exports.createExpense = async (data) => {
  const isoDate = new Date(data.date);
  return prisma.expense.create({
    data: {
      ...data,
      date: isoDate,
    },
  });
};

exports.getById = async (id) => {
  return prisma.expense.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      category: true, // Inclui os dados da categoria
      paymentMethod: true, // Inclui os dados do método de pagamento
    },
  });
};

exports.getAllExpenses = async (orderBy) => {
  console.log(JSON.parse(orderBy));
  return prisma.expense.findMany({
    include: {
      category: true, // Inclui os dados da categoria
      paymentMethod: true, // Inclui os dados do método de pagamento
    },
    orderBy: JSON.parse(orderBy),
  });
};

exports.getExpenses = async (month, year, orderBy) => {
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
    orderBy,
    // orderBy: {
    //   date: "desc",
    // },
  });
};

exports.updateExpense = async (id, data) => {
  return prisma.expense.update({
    where: {
      id: parseInt(id),
    },
    data: {
      ...data,
    },
  });
};

exports.deleteManyExpenses = async (ids) => {
  return prisma.expense.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};
