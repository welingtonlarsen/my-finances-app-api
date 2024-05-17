"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExpenseQuery {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async fetchAll(page = 1, size = 10) {
        if (page <= 0)
            throw new Error('Invalid page');
        const skip = (page - 1) * size;
        const expenses = await this.prisma.expense.findMany({
            include: {
                paymentMethod: true
            },
            skip,
            take: size,
            orderBy: {
                date: 'desc'
            }
        });
        const totalAmount = expenses.reduce((sum, current) => sum + current.amount, 0);
        return {
            expenses,
            totalAmount
        };
    }
    async fetchSummedExpensesGroupedByPaymentType() {
        return this.prisma.$queryRaw `
      SELECT sum(ex.amount) as sum, pm.name as "paymentMethodName", pm.id as "paymentMethodId"
      FROM "Expense" ex
      LEFT JOIN "PaymentMethod" pm ON ex."paymentMethodId" = pm.id
      GROUP BY pm."name", pm.id;
    `;
    }
}
exports.default = ExpenseQuery;
