export default interface ExpenseDTO {
  amount: number
  description: string
  date: Date
  categoryId: number
  paymentMethodId: number
  installments: number
  currentInstallment: number
}
