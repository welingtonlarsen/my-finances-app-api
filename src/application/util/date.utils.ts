export function convertToDate(month: string, year: number): Date {
  // Converte o mês para a forma correta (primeira letra maiúscula, restante minúsculo)
  const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();

  // Agora cria a data
  const monthIndex = new Date(`${formattedMonth} 1, ${year}`).getMonth();
  return new Date(year, monthIndex, 1);
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  const targetMonth = result.getMonth() + months;
  const year = result.getFullYear() + Math.floor(targetMonth / 12);
  const month = targetMonth % 12;

  result.setFullYear(year, month, 1); // Set to first day of target month

  // Get the last day of the target month
  const lastDay = new Date(year, month + 1, 0).getDate();
  // Use the original day or the last day of the month, whichever is smaller
  const targetDay = Math.min(date.getDate(), lastDay);

  result.setDate(targetDay);
  return result;
}
