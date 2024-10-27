<script setup>
import { computed, reactive, ref } from 'vue'
import { useStore } from '@/stores/store'
import { toCurrency } from './shared/functions.ts'
import DatasetItem from '@/components/DatasetItem.vue'
import EditDataset from '@/components/EditDataset.vue'
import DeleteDataset from '@/components/DeleteDataset.vue'
import { CheckIcon } from 'vue-tabler-icons'
import draggable from 'vuedraggable'

const props = defineProps(['datasets', 'collapsed'])
const store = useStore()

const datasetRefs = ref([])

const state = reactive({
  dataset: null,
  editModalVisible: false,
  deleteModalVisible: false
})

function editDataset(dataset) {
  state.dataset = null
  state.dataset = dataset
  state.editModalVisible = true
}

function deleteDataset(dataset) {
  state.dataset = null
  state.dataset = dataset
  state.deleteModalVisible = true
}

const isPositiveDiff = computed(() => parseFloat(totalDiffAmount.value.toFixed(2)) > 0)
const isNegativeDiff = computed(() => parseFloat(totalDiffAmount.value.toFixed(2)) < 0)

const totalInvoiceAmount = computed(() => {
  return props.datasets.reduce(
    (sum, dataset) => (dataset.invoiceAmount ? (sum += dataset.invoiceAmount) : sum),
    0
  )
})

const totalActualAmount = computed(() => {
  return props.datasets.reduce(
    (sum, dataset) => (dataset.actualAmount ? (sum += dataset.actualAmount) : sum),
    0
  )
})

const totalDebitAmount = computed(() => {
  return props.datasets.reduce(
    (sum, dataset) => (dataset.debitAmount ? (sum += dataset.debitAmount) : sum),
    0
  )
})

const totalDiffAmount = computed(() => {
  return props.datasets.reduce(
    (sum, dataset) => (dataset.diffAmount ? (sum += dataset.diffAmount) : sum),
    0
  )
})

const totalMonthlyAmount = computed(() => {
  return props.datasets.reduce(
    (sum, dataset) => (dataset.monthlyAmount ? (sum += dataset.monthlyAmount) : sum),
    0
  )
})

const totalUpdateAmount = computed(() => {
  return props.datasets.reduce(
    (sum, dataset) => (dataset.updateAmount ? (sum += dataset.updateAmount) : sum),
    0
  )
})

const hasUpdateAmounts = computed(() => {
  return props.datasets.filter((dataset) => !!dataset.updateAmount).length > 0
})

function applyUpdate() {
  datasetRefs.value.map((datasetRef) => datasetRef.applyUpdate())
}

function fillUpdateFields() {
  datasetRefs.value.map((datasetRef) => datasetRef.fillUpdateField())
}

function onSort(args) {
  //
}

function onDragStart(args) {
  navigator.vibrate(100)
}

defineExpose({
  applyUpdate,
  fillUpdateFields
})
</script>

<template>
  <ModalWindow
    :show="state.editModalVisible"
    @close="state.editModalVisible = false"
    @afterLeave="state.dataset = null"
  >
    <EditDataset
      v-if="state.dataset"
      :dataset="state.dataset"
      @close="state.editModalVisible = false"
    />
  </ModalWindow>

  <ModalWindow
    :show="state.deleteModalVisible"
    max-width="400px"
    @close="state.deleteModalVisible = false"
  >
    <DeleteDataset
      v-if="state.dataset"
      :dataset="state.dataset"
      @close="state.deleteModalVisible = false"
    />
  </ModalWindow>

  <div :class="{ expanded: !collapsed }">
    <div class="list-head">
      <div class="prop prop-title">
        <span>Titel</span>
      </div>
      <div class="prop prop-invoice-amount">Rg.-Betrag</div>
      <div class="prop prop-monthly-amount">Mtl. Betrag</div>
      <div class="prop prop-invoice-date">Rg.-Datum</div>
      <div class="prop prop-interval">Interval</div>
      <div class="prop prop-update-amount">Update</div>
      <div class="prop prop-actual-amount">Ist</div>
      <div class="prop prop-debit-amount">Soll</div>
      <div class="prop prop-diff-amount">Differenz</div>
      <div class="prop prop-menu"></div>
    </div>

    <draggable
      :list="datasets"
      class="list"
      handle=".drag-handle"
      group="datasets"
      item-key="id"
      delay="150"
      @change="onSort"
      @start="onDragStart"
    >
      <template #item="{ element }">
        <DatasetItem
          :ref="(el) => datasetRefs.push(el)"
          :dataset="element"
          @delete="(dataset) => deleteDataset(dataset)"
          @edit="(dataset) => editDataset(dataset)"
        />
      </template>
    </draggable>

    <div class="list-footer">
      <div class="prop prop-title"></div>
      <div class="prop prop-invoice-amount">
        <span class="label">Rg.-Betrag</span>
        <span class="value">{{ toCurrency(totalInvoiceAmount) }}</span>
      </div>
      <div class="prop prop-monthly-amount">
        <span class="label">Mtl. Betrag</span>
        <span class="value">{{ toCurrency(totalMonthlyAmount) }}</span>
      </div>
      <div class="prop prop-invoice-date"></div>
      <div class="prop prop-interval"></div>
      <div class="prop prop-update-amount">
        <div class="update-amount-inner">
          <div class="amount">
            <span class="label">Update</span>
            <span class="value">{{ toCurrency(totalUpdateAmount) }}</span>
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
        <span class="label">Ist</span>
        <span class="value">{{ toCurrency(totalActualAmount) }}</span>
      </div>
      <div class="prop prop-debit-amount">
        <span class="label">Soll</span>
        <span class="value">{{ toCurrency(totalDebitAmount) }}</span>
      </div>
      <div class="prop prop-diff-amount">
        <span class="label">Differenz</span>
        <span
          class="value"
          :class="{
            positive: isPositiveDiff,
            negative: isNegativeDiff
          }"
          >{{ toCurrency(totalDiffAmount) }}</span
        >
      </div>
      <div class="prop prop-menu"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.list {
  align-items: flex-start;
}

.positive {
  color: $green-600;
}

.negative {
  color: $red-600;
}

.list-head {
  display: none;
}

.list-footer {
  padding: 0.5rem calc(0.5rem + 20px + 1rem) 1.5rem calc(20px + 0.75rem);
  font-weight: 500;
}

.prop {
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  padding: 0;
}

.prop-title {
  justify-content: flex-start;
  font-size: 1.5rem;
  line-height: 2rem;
  padding-left: calc(20px + 0.25rem);
}

.prop-invoice-amount,
.prop-monthly-amount,
.prop-actual-amount,
.prop-debit-amount,
.prop-diff-amount {
  text-align: right;
}

.prop-invoice-date,
.prop-interval {
  display: none;
}

.prop-update-amount {
}

.update-amount-inner {
  display: flex;
  flex-grow: 1;
  flex-direction: column;

  .amount {
    display: flex;
    flex-grow: 1;
    text-align: right;
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

.icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: $sm) {
  .prop-title {
    flex-basis: 100%;
  }
}

@media (min-width: $xxl) {
  .list {
    display: block;
  }

  .list-head,
  .list-footer {
    display: flex;
    font-weight: 500;
    align-items: center;
    gap: 0 1rem;
    padding: 0 0.5rem;
  }

  .list-footer {
    color: $gray-400;
    padding-top: 0;
  }

  .prop {
    display: block;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .prop-invoice-date,
  .prop-interval {
    display: flex;
  }

  .prop-title {
    flex-basis: auto;
    font-size: 1rem;
    line-height: 1.5rem;
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

  .prop-menu {
    width: 20px;
    flex-grow: 0;
    flex-shrink: 0;
  }

  .prop-update-amount {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 200px;
  }

  span.label {
    display: none;
  }
}
</style>
