const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createCategory = async (name) => {
  return await prisma.category.create({
    data: {
      name: name,
    },
  });
};

exports.getCategories = async () => {
  return await prisma.category.findMany()
}