const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getPaymentMethods = async (req, res) => {
    try {
      const paymentMethods = await prisma.paymentMethod.findMany()
      res.status(200).json(paymentMethods);
    } catch(error) {
      res.status(500).json({ message: error.message });
    }
}