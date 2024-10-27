<script setup>
import { nextTick, reactive, ref, toRaw, watch } from 'vue'
import { useStore } from '@/stores/store'
// import { useStockStore } from '@/stores/stock-store'
// import { useStockApi } from '@/composables/stockapi'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import CurrencyInput from '@/components/CurrencyInput.vue'
import { SearchIcon } from 'vue-tabler-icons'
// import { getStockDataBySymbol } from './shared/functions.ts'
// import { notify } from '@kyvg/vue3-notification'

const store = useStore()
// const stockStore = useStockStore()
// const stockApi = useStockApi()
const props = defineProps(['dataset'])
const emit = defineEmits(['close'])
const symbolSearchInput = ref(null)
const symbolSearchResults = ref([])
const searchButtonDisabled = ref(true)

let data = Object.assign({}, toRaw(props.dataset))
let state = reactive({
  dataset: data,
  errors: []
})

let searchSymbolVisible = ref(false)

watch(
  () => props.dataset,
  (newData, oldData) => {
    data = Object.assign({}, toRaw(newData))
    state.dataset = data
    state.errors = []
  }
)

// function showSearchSymbol() {
//   searchSymbolVisible.value = true
//   nextTick((_) => symbolSearchInput.value.focus())
// }

// function hideSearchSymbol() {
//   searchSymbolVisible.value = false
// }

// function selectSymbol(symbolData) {
//   state.dataset.symbol = symbolData['1. symbol']
//   state.dataset.currency = symbolData['8. currency']
//   hideSearchSymbol()
// }

// async function searchSymbol() {
//   const response = await fetch(
//     `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbolSearchInput.value.value}&apikey=${stockStore.apiKey}`
//     // 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=tesco&apikey=demo'
//   )
//   const resultData = await response.json()
//   symbolSearchResults.value = resultData.bestMatches
// }

function validate() {
  state.errors = []

  if (!state.dataset.type) state.errors.push('type')
  if (!state.dataset.groupId) state.errors.push('groupId')
  if (!state.dataset.title) state.errors.push('title')

  switch (state.dataset.type) {
    case 1:
      if (!state.dataset.invoiceDate) state.errors.push('invoiceDate')
      if (!state.dataset.interval) state.errors.push('interval')
      if (isNaN(state.dataset.invoiceAmount)) state.errors.push('invoiceAmount')
      break
    case 2:
      if (isNaN(state.dataset.monthlyAmount)) state.errors.push('monthlyAmount')
      break
    case 3:
      if (!state.dataset.symbol) state.errors.push('symbol')
      if (!state.dataset.shares) state.errors.push('shares')
      break
    default:
      state.errors.push('type')
  }

  return state.errors.length === 0
}

async function save() {
  const isValid = validate()

  if (!isValid) return

  // const stockData = getStockDataBySymbol(state.dataset.symbol, stockStore)
  // const todaysStockData = stockData !== null ? stockApi.getLatestData(stockData.time_series) : null

  // console.log('todaysStockData', todaysStockData)

  // if (todaysStockData === null) {
  //   stockApi.loadStockData([state.dataset.symbol])
  // }

  if (state.dataset.id === null) {
    state.dataset.id = store.nextDatasetId
    store.addDataset(state.dataset)
  } else {
    store.replaceDataset(state.dataset)
  }
  emit('close')
}

function handleDate(invoiceDate) {
  state.dataset.invoiceDate = format(invoiceDate, 'yyyy-MM-dd')
}

function onSymbolSearchInput(e) {
  searchButtonDisabled.value = e.target.value.trim().length === 0
}
</script>

<template>
  <div>
    <div class="modal-head">
      <span v-if="state.dataset.id">Datensatz bearbeiten</span>
      <span v-else>Datensatz erstellen</span>
    </div>

    <div v-if="state.errors.length" class="errors">
      Ups! Ihre Eingaben sind unvollständig oder fehlerhaft. Bitte überprüfen Sie Ihre Eingaben.
    </div>

    <div class="mb-4">
      <label for="ds-new-type">Typ</label>
      <select id="ds-new-type" v-model.number="state.dataset.type">
        <option value="" style="display: none">Auswählen</option>
        <option value="1">Rechnung</option>
        <option value="2">Sparplan</option>
        <!--<option value="3">Wertpapier</option>-->
      </select>
    </div>

    <div v-if="state.dataset.type" class="mb-4">
      <div class="mb-4">
        <label for="ds-new-title">Titel</label>
        <input type="text" id="ds-new-title" v-model="state.dataset.title" />
      </div>

      <div class="mb-4">
        <label for="ds-new-group">Gruppe</label>
        <select id="ds-new-group" v-model.number="state.dataset.groupId">
          <option value="" style="display: none">Auswählen</option>
          <option v-for="(datagroup, index) in store.datagroups" :value="datagroup.id" :key="index">
            {{ datagroup.title }}
          </option>
        </select>
      </div>

      <div v-if="state.dataset.type === 1">
        <div class="mb-4">
          <label for="ds-new-invoice-date">Rechnungsdatum</label>
          <Datepicker
            v-model="state.dataset.invoiceDate"
            @update:modelValue="handleDate"
            :enableTimePicker="false"
            locale="de-DE"
            :format-locale="de"
            format="dd.MM.yyyy"
            autoApply
          />
        </div>

        <div class="mb-4">
          <label for="ds-new-interval">Interval</label>
          <select id="ds-new-interval" v-model="state.dataset.interval">
            <option value="">Auswählen</option>
            <option value="quarter">Quartal</option>
            <option value="year">Jahr</option>
            <option value="2years">2 Jahre</option>
          </select>
        </div>

        <div class="mb-4">
          <label for="ds-new-invoice-amount">Rechnungsbetrag</label>
          <CurrencyInput
            v-model.number="state.dataset.invoiceAmount"
            :options="{ currency: 'EUR', locale: 'de-DE', autoDecimalDigits: true }"
            classes="w-full"
          />
        </div>
      </div>

      <div v-else-if="state.dataset.type === 2">
        <div class="mb-4">
          <label for="ds-new-monthly-amount">Pro Monat</label>
          <CurrencyInput
            v-model.number="state.dataset.monthlyAmount"
            @blur="() => (state.dataset.monthlyAmount = state.dataset.monthlyAmount || 0)"
            :options="{ currency: 'EUR', locale: 'de-DE', autoDecimalDigits: true }"
            classes="w-full"
          />
        </div>
      </div>

      <div v-else-if="state.dataset.type === 3">
        <div class="mb-4">
          <label for="ds-new-symbol">Symbol</label>
          <input
            v-if="!searchSymbolVisible"
            type="text"
            id="ds-new-symbol"
            v-model="state.dataset.symbol"
          />
          <div v-if="!searchSymbolVisible" class="text-right">
            <a @click="showSearchSymbol">Symbol finden</a>
          </div>
          <div class="flex" v-if="searchSymbolVisible">
            <div class="input-button-group">
              <input
                type="text"
                id="ds-new-symbol-search"
                ref="symbolSearchInput"
                @keyup.enter="searchSymbol"
                @input="onSymbolSearchInput"
              />
              <button @click="searchSymbol" class="button" :disabled="searchButtonDisabled">
                <SearchIcon class="w-5 h-5 mx-auto" />
              </button>
            </div>
          </div>
          <div
            v-if="searchSymbolVisible && symbolSearchResults.length"
            class="symbol-search-results"
          >
            <div v-for="(result, index) in symbolSearchResults" class="search-result" :key="index">
              <div>
                <div>Symbol: {{ result['1. symbol'] }}</div>
                <div>Name: {{ result['2. name'] }}</div>
                <div>Region: {{ result['4. region'] }}</div>
                <div>Währung: {{ result['8. currency'] }}</div>
              </div>
              <div>
                <button @click="(e) => selectSymbol(result)" class="button">Auswählen</button>
              </div>
            </div>
          </div>
          <div v-if="searchSymbolVisible" class="text-right">
            <a @click="hideSearchSymbol">Suche schließen</a>
          </div>
        </div>
        <div class="mb-4">
          <label for="ds-new-currency">Währung</label>
          <select id="ds-new-currency" v-model="state.dataset.currency">
            <option value="" :selected="!state.dataset.currency">Auswählen</option>
            <option value="EUR" :selected="state.dataset.currency === 'EUR'">EUR</option>
            <option value="USD" :selected="state.dataset.currency === 'USD'">USD</option>
          </select>
        </div>
        <div class="mb-4">
          <label for="ds-new-isin">ISIN</label>
          <input type="text" id="ds-new-isin" v-model="state.dataset.isin" />
        </div>
        <div class="mb-4">
          <label for="ds-new-wkn">WKN</label>
          <input type="text" id="ds-new-wkn" v-model="state.dataset.wkn" />
        </div>
        <div class="mb-4">
          <label for="ds-new-shares">Anteile</label>
          <input type="number" id="ds-new-shares" v-model="state.dataset.shares" />
        </div>
      </div>
    </div>

    <div class="buttons">
      <button @click="$emit('close')" class="button large hollow">Schließen</button>
      <button @click="save" class="button large">Speichern</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.mb-4 {
  margin-bottom: 1rem;
}

.errors {
  margin-bottom: 1rem;
  padding: 1.25rem;
  color: $red-700;
  border: 1px solid $red-700;
  background-color: $red-100;
  border-radius: 0.25rem;
}

.symbol-search-results {
  padding-top: 0.5rem;
}

.input-button-group {
  display: flex;

  input {
    flex: 1;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

.search-result {
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid $gray-300;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem 0;
}

.buttons {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}
</style>
