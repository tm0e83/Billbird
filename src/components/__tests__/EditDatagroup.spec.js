import { describe, it, expect } from 'vitest'
import { createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { useStore } from '@/stores/store'
import EditDatagroup from '../EditDatagroup.vue'
import datagroupJson from './helper/datagroup.json'

const wrapper = mount(EditDatagroup, {
  global: {
    plugins: [createPinia()]
  },
  props: {
    datagroup: datagroupJson
  }
})

const store = useStore()

store.datagroups = [datagroupJson]

describe('EditDatagroup', () => {
  it('renders the correct title in the input field', () => {
    expect(wrapper.get('#ds-new-title').element.value).toBe(datagroupJson.title)
  })
})
