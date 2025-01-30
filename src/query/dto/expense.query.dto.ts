export default interface ExpenseQueryDTO {
  expenses: {
    firstInstallment: Array<{
      id: number
      amount: number
      description: string
      date: Date
      categoryId: number
      paymentMethodId: number
      installments: number
      currentInstallment: number
      paymentMethod: {
        id: number
        name: string
        paymentType: string
        userId: number | null
      }
    }>
    remainingInstallments: Array<{
      id: number
      amount: number
      description: string
      date: Date
      categoryId: number
      paymentMethodId: number
      installments: number
      currentInstallment: number
      paymentMethod: {
        id: number
        name: string
        paymentType: string
        userId: number | null
      }
    }>
  }
  totalAmount: number
}
