import { format } from 'date-fns'
import { nextTick, reactive, ref, toRaw, watch, onUpdated } from 'vue'

export const toCurrency = (num: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(Number(num.toFixed(2)) + 0)
}

// export const stockSymbolToKey = (symbol: string) => symbol.replace('.', '_')

// export const keyTostockSymbol = (symbol: string) => symbol.replace('_', '.')

export const isWeekend = (date: Date): boolean => date.getDay() === 6 || date.getDay() === 0

// export const getActualAmount = (dataset: any, store: any) => {
//   if (dataset.type === 3) {
//     const currentDateString = format(new Date(), 'yyyy-MM-dd')
//     const stockData = getStockDataBySymbol(dataset.symbol, store)
//     const todaysData = stockData ? stockData.time_series[currentDateString] : null

//     let amount = dataset.shares * (todaysData ? todaysData.open : 0)

//     if (dataset.currency !== 'EUR') {
//       const exchangeRate =
//         store.exchange_rates[`${dataset.currency}_EUR`][currentDateString].exchange_rate
//       amount *= exchangeRate
//     }

//     return toCurrency(amount)
//   }

//   return toCurrency(dataset.actualAmount)
// }

// export const getStockDataBySymbol = (symbol: string, store: any) => {
//   console.log(toRaw(store))
//   const stockData = store?.stocks[symbol]
//   return stockData ?? null
// }
