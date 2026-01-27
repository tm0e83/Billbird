<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from '@/stores/store'
import DatagroupItem from '@/components/DatagroupItem.vue'
import { toCurrency } from './shared/functions'
import { CheckIcon } from 'vue-tabler-icons'
import draggable from 'vuedraggable'
import { trimDecimals } from '@/utils/number'

const store = useStore()
const datagroupRefs = ref<any[]>([])

function applyUpdate(): void {
  datagroupRefs.value.map((datagroupRef) => datagroupRef.applyUpdate())
}

function fillUpdateFields(): void {
  datagroupRefs.value.map((datagroupRef) => datagroupRef.fillUpdateFields())
}

function onDragStart(): void {
  navigator.vibrate(100)
}

const hasUpdateAmounts = computed<boolean>(() => {
  return store.allDatasets.filter((dataset) => !!dataset.updateAmount).length > 0
})

const isPositiveDiff = computed<boolean>(() => trimDecimals(store.totalDiffAmount) > 0)
const isNegativeDiff = computed<boolean>(() => trimDecimals(store.totalDiffAmount) < 0)

defineExpose({
  applyUpdate,
  fillUpdateFields
})
</script>

<template>
  <div class="outer-list">
    <draggable
      :list="store.datagroups"
      class="list"
      group="datagroups"
      handle=".drag-handle"
      item-key="id"
      delay="150"
      @start="onDragStart"
    >
      <template #item="{ element }">
        <DatagroupItem
          :ref="(el) => datagroupRefs.push(el)"
          :datagroup="element"
          @edit="(datagroup) => $emit('editDatagroup', datagroup)"
          @delete="(datagroup) => $emit('deleteDatagroup', datagroup)"
        />
      </template>
    </draggable>

    <div class="list-footer">
      <div class="prop prop-title">Summe</div>
      <div class="prop prop-invoice-amount">
        <span class="label">Rg.-Betrag</span>
        <span class="value">{{ toCurrency(store.totalInvoiceAmount) }}</span>
      </div>
      <div class="prop prop-monthly-amount">
        <span class="label">Mtl. Betrag</span>
        <span class="value">{{ toCurrency(store.totalMonthlyAmount) }}</span>
      </div>
      <div class="prop prop-invoice-date"></div>
      <div class="prop prop-interval"></div>
      <div class="prop prop-update-amount">
        <div class="update-amount-inner">
          <div class="amount">
            <span class="label">Update</span>
            <span class="value">{{ toCurrency(store.totalUpdateAmount) }}</span>
          </div>
          <button
            @click="applyUpdate"
            :disabled="!hasUpdateAmounts"
            class="button"
            title="Update für alle Datensätze ausführen"
          >
            <CheckIcon class="icon" />
          </button>
        </div>
      </div>
      <div class="prop prop-actual-amount">
        <span class="label">Ist</span>
        <span class="value">{{ toCurrency(store.totalActualAmount) }}</span>
      </div>
      <div class="prop prop-debit-amount">
        <span class="label">Soll</span>
        <span class="value">{{ toCurrency(store.totalDebitAmount) }}</span>
      </div>
      <div class="prop prop-diff-amount">
        <span class="label">Differenz</span>
        <span
          class="value"
          :class="{
            positive: isPositiveDiff,
            negative: isNegativeDiff
          }"
          >{{ toCurrency(store.totalDiffAmount) }}</span
        >
      </div>
      <div class="prop prop-menu"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables';
@use '@/assets/styles/mixins';

.outer-list {
  box-shadow: 0 0 2px 0 rgb(99, 99, 99, 0.15);
}

.positive {
  color: variables.$green-600;
}

.negative {
  color: variables.$red-600;
}

.list-footer {
  background-color: variables.$gray-100;
  padding: 1.5rem calc(0.5rem + 20px + 1rem) 1.5rem calc(20px + 0.75rem);
  border-top: 1px solid variables.$gray-300;
  gap: 0 1rem;
  font-weight: 500;
}

.prop {
  padding: 0;
  display: flex;
  justify-content: space-between;

  &.invoice-date,
  &.interval {
    display: none;
  }
}

.prop-title {
  flex: 1 1 0%;
  font-weight: bold;
}

.prop-invoice-amount,
.prop-monthly-amount,
.prop-update-amount,
.prop-actual-amount,
.prop-debit-amount,
.prop-diff-amount,
.prop-invoice-date,
.prop-interval {
  flex-grow: 0;
  flex-shrink: 0;
}

.prop-invoice-amount,
.prop-monthly-amount,
.prop-actual-amount,
.prop-debit-amount,
.prop-diff-amount,
.prop-invoice-date,
.prop-interval {
  flex-basis: 140px;
}

.prop-update-amount {
  flex-basis: 200px;
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
    display: flex;
    flex-grow: 1;
    text-align: right;
    justify-content: space-between;
  }

  button {
    align-self: flex-end;
  }

  @media (min-width: variables.$xxl) {
    align-items: center;
    flex-direction: row;

    .amount {
      padding: 0.5rem 0.75rem;
      justify-content: flex-end;
    }
  }
}

.prop-menu {
  flex-grow: 0;
  flex-shrink: 0;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: variables.$xxl) {
  .list-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 0 0.5rem;
    font-weight: bold;
  }

  .prop {
    display: block;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;

    &.invoice-date,
    &.interval {
      display: block;
    }
  }

  .prop-title {
    visibility: hidden;
    padding-left: calc(20px + 0.25rem);
  }

  .prop-menu {
    width: 20px;
  }

  span.label {
    display: none;
  }
}
</style>
