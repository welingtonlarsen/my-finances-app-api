export default interface ExpenseQueryDTO {
  expenses: Array<{
    id: number
    amount: number
    description: string
    date: Date
    categoryId: number
    paymentMethodId: number
    installments: number
    currentInstallment: number
  }>
  totalAmount: number
}
