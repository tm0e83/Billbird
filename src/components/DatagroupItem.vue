<script setup>
import { computed, reactive, ref } from 'vue'
import { useStore } from '@/stores/store'
import { toCurrency } from './shared/functions.ts'
import DatasetList from '@/components/DatasetList.vue'
import { trimDecimals } from '@/utils/number'
import {
  CheckIcon,
  GripVerticalIcon,
  DotsVerticalIcon
} from 'vue-tabler-icons'
import DropdownMenu from '@/components/DropdownMenu.vue'

const props = defineProps(['datagroup'])
const store = useStore()
const emit = defineEmits(['edit', 'delete'])
const datasetListRef = ref(null)

const state = reactive({
  collapsed: true
})

const isActive = computed(() => props.datagroup.active === true)
const isInctive = computed(() => props.datagroup.active === false)

const menuItems = reactive([
  {
    label: 'Ausfüllen',
    onClick: () => fillUpdateFields()
  },
  {
    label: 'Bearbeiten',
    onClick: () => emit('edit', props.datagroup)
  },
  {
    label: 'Löschen',
    onClick: () => emit('delete', props.datagroup)
  },
  {
    label: 'Aktivieren',
    onClick: () => activate(),
    condition: isInctive
  },
  {
    label: 'Deaktivieren',
    onClick: () => deactivate(),
    condition: isActive
  }
])

const totalActualAmount = computed(() => {
  return props.datagroup.datasets.reduce(
    (sum, dataset) => (dataset.actualAmount ? (sum += dataset.actualAmount) : sum),
    0
  )
})

const totalInvoiceAmount = computed(() => {
  return props.datagroup.datasets.reduce(
    (sum, dataset) => (dataset.invoiceAmount ? (sum += dataset.invoiceAmount) : sum),
    0
  )
})

const totalDebitAmount = computed(() => {
  return props.datagroup.datasets.reduce(
    (sum, dataset) => (dataset.debitAmount ? (sum += dataset.debitAmount) : sum),
    0
  )
})

const totalDiffAmount = computed(() => {
  return props.datagroup.datasets.reduce(
    (sum, dataset) => (dataset.diffAmount ? (sum += dataset.diffAmount) : sum),
    0
  )
})

const totalMonthlyAmount = computed(() => {
  return props.datagroup.datasets.reduce(
    (sum, dataset) => (dataset.monthlyAmount ? (sum += dataset.monthlyAmount) : sum),
    0
  )
})

const totalUpdateAmount = computed(() => {
  return props.datagroup.datasets.reduce(
    (sum, dataset) => (dataset.updateAmount ? (sum += dataset.updateAmount) : sum),
    0
  )
})

const hasUpdateAmounts = computed(() => {
  return props.datagroup.datasets.filter((dataset) => !!dataset.updateAmount).length > 0
})

const isPositiveDiff = computed(() => trimDecimals(totalDiffAmount.value) > 0)
const isNegativeDiff = computed(() => trimDecimals(totalDiffAmount.value) < 0)

function activate() {
  store.activateDatagroup(props.datagroup.id)
}

function deactivate() {
  state.collapsed = true
  store.deactivateDatagroup(props.datagroup.id)
}

function toggle(e) {
  if (!props.datagroup.active) return
  if (e.target.classList.contains('button') || e.target.closest('.button')) return
  state.collapsed = !state.collapsed
}

function applyUpdate() {
  if (props.datagroup.active && datasetListRef.value) datasetListRef.value.applyUpdate()
}

function fillUpdateFields() {
  if (datasetListRef.value) datasetListRef.value.fillUpdateFields()
}

defineExpose({
  applyUpdate,
  fillUpdateFields
})
</script>

<template>
  <div class="datagroup" :class="{ collapsed: state.collapsed, inactive: !isActive }">
    <div class="head" @click="toggle">
      <div class="prop prop-title">
        <button class="button drag-handle secondary clear">
          <GripVerticalIcon />
        </button>
        <span class="title-text">{{ datagroup.title }}</span>
      </div>
      <div class="prop prop-invoice-amount">
        <span>{{ toCurrency(totalInvoiceAmount) }}</span>
      </div>
      <div class="prop prop-monthly-amount">
        <span title="Mtl. Betrag">{{ toCurrency(totalMonthlyAmount) }}</span>
      </div>
      <div class="prop prop-invoice-date"></div>
      <div class="prop prop-interval"></div>
      <div class="prop prop-update-amount">
        <div class="update-amount-inner">
          <div class="amount">
            <span>{{ toCurrency(totalUpdateAmount) }}</span>
          </div>
          <button
            @click="applyUpdate"
            :disabled="!hasUpdateAmounts"
            class="button"
            title="Update für alle Datensätze der Gruppe ausführen"
          >
            <CheckIcon />
          </button>
        </div>
      </div>
      <div class="prop prop-actual-amount">
        <span title="Ist">{{ toCurrency(totalActualAmount) }}</span>
      </div>
      <div class="prop prop-debit-amount">
        <span title="Soll">{{ toCurrency(totalDebitAmount) }}</span>
      </div>
      <div class="prop prop-diff-amount">
        <span
          title="Differenz"
          :class="{
            positive: isPositiveDiff,
            negative: isNegativeDiff
          }"
          >{{ toCurrency(totalDiffAmount) }}</span
        >
      </div>
      <div class="prop prop-menu">
        <div class="menu">
          <DropdownMenu :menuItems="menuItems">
            <DotsVerticalIcon />
          </DropdownMenu>
        </div>
      </div>
    </div>

    <div class="list">
      <DatasetList
        ref="datasetListRef"
        v-if="datagroup.datasets.length"
        :datasets="datagroup.datasets"
        :collapsed="state.collapsed"
      />
      <div v-else class="no-results-message">Diese Datengruppe enthält keine Datensätze.</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.datagroup {
  background-color: #fff;
  margin-bottom: 1px;

  .positive {
    color: $green-600;
  }

  .negative {
    color: $red-600;
  }

  &.sortable-chosen .head {
    border: 1px dashed $primary-color;
  }

  &:last-of-type {
    margin-bottom: 0;
  }

  &.inactive {
    color: $gray-300;
  }

  .head {
    padding: 0 0.5rem;
    align-items: center;
    display: flex;
    gap: 0 1rem;
    min-height: 3.25rem;
    font-weight: bold;
    cursor: pointer;
    box-shadow: inset 0 -1px 0 0 $gray-200;

    .current-value {
      display: none;
    }
  }

  &.inactive {
    .head {
      cursor: default;
    }
  }

  .drag-handle {
    cursor: grab;
    padding: 0;
    flex-grow: 0;
    margin-right: 0.25rem;
  }

  .prop {
    padding: 0.5rem 0;
  }

  .prop-title {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 1.125rem;
    line-height: 1.75rem;
    text-transform: uppercase;
    user-select: none;
    overflow: hidden;

    .title-text {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .prop-debit-amount,
  .prop-diff-amount,
  .prop-invoice-amount,
  .prop-monthly-amount,
  .prop-invoice-date,
  .prop-interval,
  .prop-update-amount {
    display: none;
  }

  .prop-invoice-amount,
  .prop-monthly-amount,
  .prop-actual-amount,
  .prop-debit-amount,
  .prop-diff-amount {
    text-align: right;
  }

  .update-amount-inner {
    display: flex;
    flex-grow: 1;
    flex-direction: column;

    .amount {
      flex-grow: 1;
      text-align: right;
      display: flex;
      justify-content: space-between;
    }

    button {
      align-self: flex-end;
    }

    @media (min-width: 1536px) {
      flex-direction: row;
      align-items: center;

      .amount {
        padding-left: 0.75rem;
        padding-right: 0.75rem;
        justify-content: flex-end;
      }

      button {
        align-self: center;
      }
    }
  }

  .prop-menu {
    display: flex;
    justify-content: flex-end;
    width: 20px;
    flex-grow: 0;
    flex-shrink: 0;
  }

  .menu {
    display: flex;
    gap: 0.25rem;
    justify-content: flex-end;
  }

  .list {
    background-color: $gray-50;
  }

  .no-results-message {
    padding: 0.5rem 0.75rem;
  }

  &[draggable='false'] .head {
    cursor: pointer;
  }

  &.collapsed {
    margin-bottom: 0;

    .list {
      display: none;
    }
  }

  @media (min-width: $xxl) {
    .head {
      justify-content: space-between;
    }

    .prop {
      justify-content: space-between;
    }

    .prop-title {
      justify-content: flex-start;
    }

    .prop-actual-amount {
      display: none;
    }

    &.collapsed {
      .prop-actual-amount,
      .prop-debit-amount,
      .prop-diff-amount,
      .prop-invoice-amount,
      .prop-monthly-amount,
      .prop-invoice-date,
      .prop-interval,
      .prop-update-amount {
        display: flex;
        justify-content: flex-end;
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: 140px;
      }

      .prop-update-amount {
        display: flex;
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: 200px;
      }
    }
  }
}
</style>
