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
  return prisma.expense.findMany({
    include: {
      category: true, // Inclui os dados da categoria
      paymentMethod: true, // Inclui os dados do método de pagamento
    },
    orderBy: orderBy ? JSON.parse(orderBy) : undefined,
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
    orderBy: orderBy ? JSON.parse(orderBy) : undefined,
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

const paymentMethodIdToSlug = {
  1: 'credit_card',
  2: 'debit_card',
  3: 'pix',
  4: 'cash',
}

exports.getSummaryOfExpenses = async (month, year) => {
  const startDate = startOfMonth(
    parse(`${month} ${year}`, "MMMM yyyy", new Date())
  );
  const endDate = endOfMonth(startDate);

  const expenses = await prisma.expense.findMany({
    where: {
      AND: [{ date: { gte: startDate } }, { date: { lt: endDate } }],
    },
    include: {
      category: true, // Inclui os dados da categoria
      paymentMethod: true, // Inclui os dados do método de pagamento
    }
  });

  return expenses.reduce((acc, current) => {
    const paymentMethod = paymentMethodIdToSlug[current.paymentMethod.id];
    const amount = current.amount
    return {
      ...acc,
      [paymentMethod]: acc[paymentMethod] + amount
    }
  }, {
    credit_card: 0,
    debit_card: 0,
    pix: 0,
    cash: 0,
  })
};
