/*
  Warnings:

  - You are about to drop the column `monthlyInvestment` on the `RetirementPlan` table. All the data in the column will be lost.
  - You are about to drop the column `retirementSalary` on the `RetirementPlan` table. All the data in the column will be lost.
  - You are about to drop the column `returnRate` on the `RetirementPlan` table. All the data in the column will be lost.
  - Added the required column `annualReturnRate` to the `RetirementPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `desiredRetirementSalary` to the `RetirementPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthlyContribution` to the `RetirementPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RetirementPlan" DROP COLUMN "monthlyInvestment",
DROP COLUMN "retirementSalary",
DROP COLUMN "returnRate",
ADD COLUMN     "annualReturnRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "desiredRetirementSalary" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "monthlyContribution" DOUBLE PRECISION NOT NULL;
