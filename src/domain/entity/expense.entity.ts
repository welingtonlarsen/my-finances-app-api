export default class ExpenseEntity {
  constructor (
    readonly amount: number,
    readonly description: string,
    readonly date: Date,
    readonly categoryId: number,
    readonly paymentMethodId: number,
    readonly installments: number,
    readonly currentInstallment: number,
    readonly id?: number
  ) {}
}
