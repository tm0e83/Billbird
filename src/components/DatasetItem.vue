<script setup>
import { computed, onBeforeUpdate, onMounted, ref } from 'vue'
import intervals from './shared/intervals.json'
import {
  // getActualAmount,
  toCurrency
} from './shared/functions.ts'
import { useStore } from '@/stores/store'
// import { useStockStore } from '@/stores/stock-store'
import { format, isValid } from 'date-fns'
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EditIcon,
  GripVerticalIcon,
  TrashIcon,
  DotsVerticalIcon
} from 'vue-tabler-icons'
import CurrencyInput from '@/components/CurrencyInput.vue'
import DropdownMenu from '@/components/DropdownMenu.vue'
import { trimDecimals } from '@/utils/number'

const props = defineProps(['dataset'])
const store = useStore()
// const stockStore = useStockStore()
const emit = defineEmits(['edit', 'delete'])
const collapsed = ref(true)
const updateAmountInput = computed({
  get: () => props.dataset.updateAmount,
  set: (value) => store.setUpdateAmount(props.dataset.id, value)
})
const menuItems = ref([
  {
    label: 'Ausfüllen',
    onClick: () => fillUpdateField()
  },
  {
    label: 'Bearbeiten',
    onClick: () => emit('edit', props.dataset)
  },
  {
    label: 'Löschen',
    onClick: () => emit('delete', props.dataset)
  }
])
const intervalName = computed(() =>
  props.dataset.type === 1 ? intervals[props.dataset.interval].name : ''
)
const isPositiveDiff = computed(() => trimDecimals(props.dataset.diffAmount) > 0)
const isNegativeDiff = computed(() => trimDecimals(props.dataset.diffAmount) < 0)

// const actualAmount = computed(() => {
//   return getActualAmount(props.dataset, stockStore)
// })

// const debitAmount = computed(() => {
//   if (props.dataset.type === 3) {
//     return actualAmount.value
//   }

//   return toCurrency(props.dataset.debitAmount)
// })

const canUpate = computed(() => {
  if (props.dataset.updateType === 'equals' && typeof props.dataset.updateAmount !== 'number') {
    return false
  }

  if (props.dataset.updateType === 'add' && !props.dataset.updateAmount) {
    return false
  }

  return true
})

function updateInvoiceDates() {
  if (props.dataset.type === 3) return

  let invoiceDate = props.dataset.invoiceDate ? new Date(props.dataset.invoiceDate) : null

  if (isValid(invoiceDate)) {
    if (invoiceDate < store.currentDate) {
      store.setLastInvoiceDate(props.dataset.id, format(invoiceDate, 'yyyy-MM-dd'))
      const monthsPerInterval = intervals[props.dataset.interval].months
      invoiceDate.setMonth(invoiceDate.getMonth() + monthsPerInterval)
      store.setInvoiceDate(props.dataset.id, format(invoiceDate, 'yyyy-MM-dd'))
    }
  }
}

function calculateMonthlyAmount() {
  if (props.dataset.type !== 1) return
  store.setMonthlyAmount(
    props.dataset.id,
    props.dataset.invoiceAmount / intervals[props.dataset.interval].months
  )
}

function calculateDebitAmount() {
  if (props.dataset.type === 3) return

  switch (props.dataset.type) {
    case 1: {
      let invoiceDate = props.dataset.invoiceDate ? new Date(props.dataset.invoiceDate) : null
      if (isValid(invoiceDate)) {
        const monthsBetween = getMonthDifference(store.currentDate, invoiceDate)
        const pastIntervalMonths = intervals[props.dataset.interval].months - monthsBetween
        store.setDebitAmount(props.dataset.id, pastIntervalMonths * props.dataset.monthlyAmount)
      }
      break
    }
    case 2: {
      store.setDebitAmount(props.dataset.id, props.dataset.actualAmount)
      break
    }
  }
}

function calculateDiffAmount() {
  store.setDiffAmount(props.dataset.id, props.dataset.actualAmount - props.dataset.debitAmount)
}

function getMonthDifference(startDate, endDate) {
  return (
    endDate.getMonth() -
    startDate.getMonth() +
    12 * (endDate.getFullYear() - startDate.getFullYear())
  )
}

function applyUpdate() {
  if (!props.dataset.updateAmount && props.dataset.updateAmount !== 0) return

  if (props.dataset.type !== 3 && props.dataset.updateType === 'add') {
    store.addActualAmount(props.dataset.id, props.dataset.updateAmount)
  } else {
    store.setActualAmount(props.dataset.id, props.dataset.updateAmount)
  }

  store.setUpdateAmount(props.dataset.id, null)
}

function changeUpdateType() {
  store.setUpdateType(props.dataset.id, props.dataset.updateType === 'add' ? 'equals' : 'add')
}

function fillUpdateField() {
  if (props.dataset.type !== 3 && props.dataset.updateType === 'add') {
    store.setUpdateAmount(props.dataset.id, props.dataset.monthlyAmount)
  }
}

onMounted(() => {
  updateInvoiceDates()
  calculateDebitAmount()
  calculateMonthlyAmount()
  calculateDiffAmount()
})

onBeforeUpdate(() => {
  updateInvoiceDates()
  calculateDebitAmount()
  calculateMonthlyAmount()
  calculateDiffAmount()
})

defineExpose({
  applyUpdate,
  fillUpdateField
})
</script>

<template>
  <div class="dataset" :class="{ collapsed: collapsed }">
    <div class="prop head" @click="collapsed = !collapsed">
      <div class="title">
        <button class="button drag-handle secondary clear">
          <GripVerticalIcon />
        </button>
        <div>
          <div>{{ dataset.title }}</div>
          <!--
            <div v-if="dataset.wkn || dataset.isin || dataset.symbol" class="stock-info">
              <span v-if="dataset.wkn">WKN: {{ dataset.wkn }}</span>
              <span v-if="dataset.isin">ISIN: {{ dataset.isin }}</span>
              <span v-if="dataset.symbol">Symbol: {{ dataset.symbol }}</span>
            </div>
          -->
        </div>
      </div>
      <div class="current-value">{{ toCurrency(dataset.actualAmount) }}</div>
      <div class="menu">
        <DropdownMenu :menuItems="menuItems">
          <DotsVerticalIcon />
        </DropdownMenu>
      </div>
    </div>

    <div class="prop prop-actual-amount">
      <span class="label">Ist</span>
      <span>{{ toCurrency(dataset.actualAmount) }}</span>
    </div>

    <div class="prop prop-debit-amount">
      <span class="label">Soll</span>
      <span>{{ toCurrency(dataset.debitAmount) }}</span>
    </div>

    <div class="prop prop-diff-amount">
      <span class="label">Differenz</span>
      <span
        class="value"
        :class="{
          positive: isPositiveDiff,
          negative: isNegativeDiff
        }"
      >
        {{ Math.floor(dataset.diffAmount) > 0 ? '+' : '' }}{{ toCurrency(dataset.diffAmount) }}
      </span>
    </div>

    <div class="prop prop-invoice-amount">
      <span class="label">Rg.-Betrag</span>
      <span v-if="dataset.invoiceAmount">
        {{ toCurrency(dataset.invoiceAmount) }}
      </span>
    </div>

    <div class="prop prop-monthly-amount">
      <span class="label">Monatlich</span>
      <span v-if="dataset.type !== 3">{{ toCurrency(dataset.monthlyAmount) }}</span>
    </div>

    <div class="prop prop-invoice-date">
      <span class="label">Rg.-Datum</span>
      <span v-if="dataset.invoiceDate">
        {{ format(new Date(dataset.invoiceDate), 'dd.MM.yyyy') }}
      </span>
    </div>

    <div class="prop prop-interval">
      <span class="label">Interval</span>
      <span>{{ intervalName }}</span>
    </div>

    <div class="prop prop-update-amount">
      <span class="label" v-if="dataset.type !== 3">Update</span>
      <div class="update-amount" v-if="dataset.type !== 3">
        <div class="update-type-buttons">
          <a @click="changeUpdateType" :class="{ active: dataset.updateType === 'add' }">+</a>
          <a @click="changeUpdateType" :class="{ active: dataset.updateType === 'equals' }">=</a>
        </div>
        <CurrencyInput
          v-model="updateAmountInput"
          :options="{
            currency: 'EUR',
            locale: 'de-DE',
            autoDecimalDigits: true
          }"
          classes="currency-input text-right"
        />
        <button @click="applyUpdate" :disabled="!canUpate" class="button">
          <CheckIcon />
        </button>
      </div>
    </div>

    <div class="prop prop-menu">
      <div class="menu">
        <DropdownMenu :menuItems="menuItems">
          <DotsVerticalIcon />
        </DropdownMenu>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.dataset {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border-bottom: 1px solid $gray-200;
  padding: 0 0.5rem;

  &.sortable-chosen {
    border: 1px dashed $primary-color;
  }
}

.positive {
  color: $green-600;
}

.negative {
  color: $red-600;
}

.prop {
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  padding: 0.1rem 0;

  &:not(.head) {
    padding-left: calc(20px + 0.25rem);
    padding-right: calc(20px + 1rem);
  }
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.drag-handle {
  cursor: move;
  padding: 0;
  flex-grow: 0;
  margin-right: 0.25rem;
}

.head {
  align-items: center;
  overflow: hidden;
  font-weight: 500;
  padding: 0.5rem 0;
  gap: 0 1rem;

  .menu {
    display: flex;
    display: flex;
    justify-content: flex-end;
    width: 20px;
  }
}

.title {
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  display: flex;
  align-items: center;
}

.stock-info {
  display: flex;
  flex-wrap: wrap;
  font-weight: normal;
  font-size: 0.85em;
  gap: 0 1rem;
}

.prop-actual-amount,
.prop-debit-amount,
.prop-diff-amount,
.prop-invoice-amount,
.prop-monthly-amount,
.prop-invoice-date,
.prop-interval {
  text-align: right;
}

.update-amount {
  display: flex;
}

.update-type-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;

  a {
    display: inline-flex;
    align-items: center;
    padding: 0 0.25rem;
    flex: 1;
    color: $gray-300;
    line-height: 1;

    &.active {
      color: $primary-color;
      font-weight: bold;
    }
  }
}

.prop-menu {
  display: none;
}

.currency-input {
  flex-grow: 1;
  max-width: 120px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;

  & + button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

@media (min-width: $sm) {
  .title {
    flex-basis: 100%;
  }
}

@media (max-width: 1535px) {
  .dataset {
    &.collapsed {
      .prop:not(.head) {
        display: none;
      }
    }

    &:not(.collapsed) {
      padding-bottom: 0.75rem;
    }
  }

  .head {
    cursor: pointer;
  }
}

@media (min-width: $xxl) {
  .dataset {
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    margin-bottom: 0;
    padding-bottom: 0;
    gap: 0 1rem;
  }

  .prop {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;

    &.collapsed {
      display: block;
    }

    &:not(.head) {
      margin-left: 0;
      padding-left: 0;
      padding-right: 0;
    }
  }

  .label {
    display: none;
  }

  .head {
    flex-basis: auto;
    font-weight: 400;

    .menu {
      display: none;
    }

    .current-value {
      display: none !important;
    }
  }

  .prop-actual-amount,
  .prop-debit-amount,
  .prop-diff-amount,
  .prop-invoice-amount,
  .prop-monthly-amount,
  .prop-invoice-date,
  .prop-interval,
  .prop-menu {
    justify-content: flex-end;
    flex-grow: 0;
    flex-shrink: 0;
  }

  .prop-actual-amount,
  .prop-debit-amount,
  .prop-diff-amount,
  .prop-invoice-amount,
  .prop-monthly-amount,
  .prop-invoice-date,
  .prop-interval {
    flex-basis: 140px;
  }

  .prop-actual-amount {
    order: 7;
  }

  .prop-debit-amount {
    order: 8;
  }

  .prop-diff-amount {
    order: 9;
  }

  .prop-menu {
    width: 20px;
    padding: 0 !important;
    display: flex;
    order: 10;

    .menu {
      display: flex;
      gap: 0.25rem;
      justify-content: flex-end;
    }
  }

  .prop-update-amount {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 200px;
    align-items: center;
  }

  .currency-input {
    max-width: initial;
  }

  .title {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    user-select: none;
  }
}
</style>
