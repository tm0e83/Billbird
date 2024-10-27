import { describe, it, expect } from 'vitest'
import { createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { useStore } from '@/stores/store'
import DeleteDataset from '../DeleteDataset.vue'
import datagroupJson from './helper/datagroup.json'
import datasetJson from './helper/dataset.json'

const wrapper = mount(DeleteDataset, {
  global: {
    plugins: [createPinia()]
  },
  props: {
    dataset: datasetJson
  }
})

const store = useStore()

store.datagroups = [Object.assign({}, datagroupJson, { datasets: [datasetJson] })]

describe('DatagroupList', () => {
  it('deletes the dataset successfully', async () => {
    expect(store.allDatasets.length).toBe(1)
    await wrapper.find('.delete-button').trigger('click')
    expect(store.allDatasets.length).toBe(0)
  })
})
