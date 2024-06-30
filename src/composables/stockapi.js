import { useStore } from '@/stores/store'
import { useStockStore } from '@/stores/stock-store'
import { getDatabase, ref as fireRef, get, child, set, update } from 'firebase/database'
import { format } from 'date-fns'
import { notify } from '@kyvg/vue3-notification'
import { keyTostockSymbol, stockSymbolToKey } from '@/components/shared/functions.ts'

export const useStockApi = () => {
  /**
   * transforms all keys within given object
   * - removes whitespaces and braces
   * - removes numbering
   * - transforms to lower case
   * @param {object} obj
   * @param {function} getNewKey
   */
  const transformKeys = (obj) => {
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        transformKeys(obj[i])
      }
    } else if (typeof obj === 'object') {
      for (const key in obj) {
        const newKey = key
          .toLowerCase()
          .replace(/^\d\. /g, '')
          .trim()
          .replace(/\(.*\)/g, '')
          .trim()
          .replace(/\s/g, '_')
          .trim()

        obj[newKey] = obj[key]

        if (key !== newKey) {
          delete obj[key]
        }

        transformKeys(obj[newKey])
      }
    }

    return obj
  }

  /**
   * returns the latest entry from the time series of given object
   * @param {object} obj
   */
  const getLatestData = (obj) => {
    const latestDate = Object.keys(obj).sort((a, b) => (new Date(a) > new Date(b) ? -1 : 1))[0]
    const latest = {}
    latest[latestDate] = obj[latestDate]
    return latest
  }

  const loadExchangeData = async (unfoundExchangeKeys) => {
    const stockStore = useStockStore()
    const db = getDatabase()
    const dbRef = fireRef(db)
    const currentDateString = format(new Date(), 'yyyy-MM-dd')

    if (unfoundExchangeKeys.length) {
      const response = await Promise.all(
        unfoundExchangeKeys.map((exchangeKey) =>
          fetch(
            // `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=demo`
            `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=EUR&apikey=${stockStore.apiKey}`
          )
        )
      )

      const resultsData = await Promise.all(
        await response.map(async (result) => await result.json())
      )

      const incompleteData = resultsData.filter(
        (data) => typeof data['Realtime Currency Exchange Rate'] === 'undefined'
      )
      const completeData = resultsData.filter(
        (data) => typeof data['Realtime Currency Exchange Rate'] !== 'undefined'
      )

      if (incompleteData.length) {
        // return Promise.reject('Tägliches API Request Limit erreicht')
        console.log('Tägliches API Request Limit erreicht')
      }

      let transformedData = transformKeys(completeData['Realtime Currency Exchange Rate'])

      // converts string numbers to floats
      transformedData.ask_price = parseFloat(transformedData.ask_price)
      transformedData.bid_price = parseFloat(transformedData.ask_price)
      transformedData.exchange_rate = parseFloat(transformedData.ask_price)

      // console.log(transformedExchangeData)

      update(
        fireRef(db, `/alphavantage/data/exchange_rates/USD_EUR/${currentDateString}`),
        transformedExchangeData
      )
        .then(() => {
          notify({
            title: 'Es wurden neue Exchange-Daten geladen',
            type: 'success'
          })
        })
        .catch((error) => {
          const errorMessage = 'Beim Speichern in die Datenbank ist ein Fehler aufgetreten'
          console.log(`${errorMessage}: ${error}`)

          notify({
            title: errorMessage,
            type: 'error'
          })
        })
    } else {
      console.log('Exchangedaten gefunden')
    }

    get(child(dbRef, '/alphavantage'))
      .then(async (snapshot) => {
        if (snapshot.exists()) {
          const alphavantage = snapshot.val()
          stockStore.exchange_rates = alphavantage.data.exchange_rates
        }
      })
      .catch((error) => {
        console.error(error)

        notify({
          title: error,
          type: 'error'
        })
      })
  }

  const loadStockData = async (unfoundSymbols) => {
    const store = useStore()
    const stockStore = useStockStore()
    const db = getDatabase()
    const dbRef = fireRef(db)
    const currentDateString = format(new Date(), 'yyyy-MM-dd')

    console.log('unfoundSymbols', unfoundSymbols)

    if (unfoundSymbols.length) {
      const response = await Promise.all(
        store.allDatasets
          .filter(
            (dataset) => dataset.symbol && unfoundSymbols.includes(stockSymbolToKey(dataset.symbol))
          )
          .map(async (dataset) => {
            console.log('dataset', dataset)
            return await fetch(
              `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${dataset.symbol}&apikey=${stockStore.apiKey}`
            )
            // return await fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo');
          })
      )

      const resultsData = await Promise.all(
        await response.map(async (result) => await result.json())
      )

      const incompleteData = resultsData.filter(
        (data) => typeof data['Time Series (Daily)'] === 'undefined'
      )
      const completeData = resultsData.filter(
        (data) => typeof data['Time Series (Daily)'] !== 'undefined'
      )

      if (incompleteData.length) {
        // return Promise.reject('Tägliches API Request Limit erreicht')
        console.log('Tägliches API Request Limit erreicht')
      }

      // converts string numbers to floats
      // insert latest data as today's data
      let transformedData = transformKeys(completeData).reduce((obj, current) => {
        if (!current['time_series'][currentDateString]) {
          current['time_series'][currentDateString] = Object.values(
            getLatestData(current['time_series'])
          )[0]
        }

        current['time_series'] = Object.keys(current['time_series']).reduce(
          (seriesData, currentKey) => {
            const dailyData = current['time_series'][currentKey]
            const dailyDataKeys = Object.keys(dailyData)
            dailyDataKeys.map((key) => (dailyData[key] = parseFloat(dailyData[key])))
            seriesData[currentKey] = dailyData
            return seriesData
          },
          {}
        )

        obj[current['meta_data']['symbol']] = current

        return obj
      }, {})

      // prepare request params
      const requestData = Object.keys(transformedData).reduce((obj, stockSymbol) => {
        const currentData = transformedData[stockSymbol]

        obj[stockSymbol] = {}
        obj[stockSymbol]['meta_data'] = currentData['meta_data']
        obj[stockSymbol]['time_series'] = Object.keys(currentData['time_series']).reduce(
          (obj2, dateStr) => {
            const currentSymbolData = currentData['time_series'][dateStr]
            obj2[dateStr] = currentSymbolData
            return obj2
          },
          {}
        )

        return obj
      }, {})

      Promise.all(
        Object.keys(requestData).map((stockSymbol) => {
          return update(
            fireRef(db, `/alphavantage/data/stocks/${stockSymbolToKey(stockSymbol)}`),
            requestData[stockSymbol]
          )
        })
      )
        .then(() => {
          notify({
            title: 'Es wurden neue Stock-Daten geladen',
            type: 'success'
          })
        })
        .catch((error) => {
          const errorMessage = 'Beim Speichern in die Datenbank ist ein Fehler aufgetreten'
          console.log(`${errorMessage}: ${error}`)

          notify({
            title: errorMessage,
            type: 'error'
          })
        })
    } else {
      console.log('Stockdaten gefunden')
    }

    get(child(dbRef, '/alphavantage'))
      .then(async (snapshot) => {
        if (snapshot.exists()) {
          const alphavantage = snapshot.val()

          alphavantage.data.stocks = Object.keys(alphavantage.data.stocks).reduce(
            (stocks, stockSymbolKey) => {
              stocks[keyTostockSymbol(stockSymbolKey)] = alphavantage.data.stocks[stockSymbolKey]
              return stocks
            },
            {}
          )

          stockStore.stocks = alphavantage.data.stocks
        }
      })
      .catch((error) => {
        console.error(error)

        notify({
          title: error,
          type: 'error'
        })
      })
  }

  return {
    getLatestData,
    loadExchangeData,
    loadStockData
  }
}
