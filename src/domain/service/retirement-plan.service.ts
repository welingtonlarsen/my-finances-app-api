import { PrismaClient } from "@prisma/client";
import { Context } from "../../infra/context/store.context";
import { RetirementPlanInputDTO } from "../dto/retirement-plan.input.dto";

export class RetirementPlanService {
  @Context('userId')
  private userId?: string;

  constructor(private readonly prismaClient: PrismaClient) {}

  async createRetirementPlan(retirementPlan: RetirementPlanInputDTO) {
    const { desiredRetirementSalary, annualReturnRate, monthlyContribution, initialNetWorth, endDate } = retirementPlan;

    // TODO: On frontend
    // const monthsToRetire = this.calculateMonthsToRetire(desiredRetirementSalary, annualReturnRate, monthlyContribution);

    // // Calculate the final retirement date based on the current date
    // const currentDate = new Date();
    // const endDate = new Date(currentDate.setMonth(currentDate.getMonth() + monthsToRetire));

    const persistedData = await this.prismaClient.retirementPlan.create({
      data: {
        initialNetWorth,
        monthlyContribution,
        desiredRetirementSalary,
        annualReturnRate,
        endDate: new Date(endDate),
        userId: Number(this.userId)
      }
    })

    return {
      id: persistedData.id,
      userId: this.userId,
      initialNetWorth: persistedData.initialNetWorth,
      desiredRetirementSalary: persistedData.desiredRetirementSalary,
      annualReturnRate: persistedData.annualReturnRate,
      endDate: persistedData.endDate,
    }
  }

  // TODO: On frontend
  private calculateMonthsToRetire(
    desiredRetirementSalary: number,
    annualReturnRate: number,
    monthlyContribution: number
  ): number {
    const monthlyReturnRate = annualReturnRate / 12; // Convert annual return rate to monthly rate
    const targetAmount = (desiredRetirementSalary * 12) / annualReturnRate; // Total amount needed to sustain desired salary
  
    let currentSavings = 0;
    let months = 0;
  
    // Loop to calculate how many months are needed to reach the target amount
    while (currentSavings < targetAmount) {
      // Apply monthly compound interest and add the monthly contribution
      currentSavings = currentSavings * (1 + monthlyReturnRate) + monthlyContribution;
      months++;
    }
  
    return months;
  }
}