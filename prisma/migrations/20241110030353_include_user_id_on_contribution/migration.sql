/*
  Warnings:

  - Added the required column `userId` to the `Contribution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ContributionBalance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `RetirementPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contribution" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ContributionBalance" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RetirementPlan" ADD COLUMN     "userId" INTEGER NOT NULL;
