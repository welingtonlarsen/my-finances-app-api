export interface RetirementPlanInputDTO {
  initialNetWorth: number;
  desiredRetirementSalary: number;
  annualReturnRate: number;
  monthlyContribution: number;
  endDate: Date;
}