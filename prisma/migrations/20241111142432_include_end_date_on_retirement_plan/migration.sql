/*
  Warnings:

  - Added the required column `endDate` to the `RetirementPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RetirementPlan" ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL;
