export const toCurrency = (num: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(Number(num.toFixed(2)) + 0)
}

export const isWeekend = (date: Date): boolean => date.getDay() === 6 || date.getDay() === 0