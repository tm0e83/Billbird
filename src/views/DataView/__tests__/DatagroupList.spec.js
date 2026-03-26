import { describe, it, expect } from 'vitest'
import { createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { useStore } from '@/stores/store'
import DatagroupList from '../DatagroupList.vue'
import datagroupJson from './helper/datagroup.json'
import datasetJson from './helper/dataset.json'

const wrapper = mount(DatagroupList, {
  global: {
    plugins: [createPinia()]
  }
})

const store = useStore()

store.datagroups = [Object.assign({}, datagroupJson, { datasets: [datasetJson] })]

describe('DatagroupList', () => {
  it('shows 1 datagroup', () => {
    expect(wrapper.findAll('.datagroup').length).toBe(1)
  })

  it('shows correct invoice sum', () => {
    const invoiceAmountSum = store.allDatasets.reduce(
      (sum, dataset) => (sum += dataset.invoiceAmount),
      0
    )
    expect(parseFloat(wrapper.find('.list-footer .prop-invoice-amount .value').text())).toBe(
      invoiceAmountSum
    )
  })
})
