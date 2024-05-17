"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CategoryQuery {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async fetchAll(page = 1, size = 10) {
        if (page <= 0)
            throw new Error('Invalid page');
        const skip = (page - 1) * size;
        const categories = await this.prisma.category.findMany({ skip, take: size });
        return categories;
    }
}
exports.default = CategoryQuery;
