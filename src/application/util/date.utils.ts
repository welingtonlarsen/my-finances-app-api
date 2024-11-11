export function convertToDate(month: string, year: number): Date {
  // Converte o mês para a forma correta (primeira letra maiúscula, restante minúsculo)
  const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();

  // Agora cria a data
  const monthIndex = new Date(`${formattedMonth} 1, ${year}`).getMonth();
  return new Date(year, monthIndex, 1);
}
