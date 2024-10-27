import { describe, it, expect } from 'vitest'
import { createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { useStore } from '@/stores/store'
import DatasetItem from '../DatasetItem.vue'
import datagroupJson from './helper/datagroup.json'
import datasetJson from './helper/dataset.json'

const wrapper = mount(DatasetItem, {
  global: {
    plugins: [createPinia()]
  },
  props: {
    dataset: datasetJson
  }
})

const store = useStore()

store.datagroups = [Object.assign({}, datagroupJson, { datasets: [datasetJson] })]

describe('DatasetItem', () => {
  it('renders the correct title', () => {
    expect(wrapper.get('.head .title').text()).toContain(datasetJson.title)
  })

  it('has a number as diffAmount', () => {
    expect(parseFloat(wrapper.get('.prop-diff-amount .value').text())).toBeTypeOf('number')
  })

  it('contains CSS class `negative`', () => {
    expect(wrapper.get('.prop-diff-amount .value').classes('negative')).toBe(true)
  })
})
