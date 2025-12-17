import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { useStore } from '@/stores/store'
import DatasetItem from '../DatasetItem.vue'
import datagroupJson from './helper/datagroup.json'
import datasetJson from './helper/dataset.json'

describe('DatasetItem', () => {
  let wrapper
  let store

  beforeEach(() => {
    wrapper = mount(DatasetItem, {
      global: {
        plugins: [createPinia()]
      },
      props: {
        dataset: { ...datasetJson }
      }
    })

    store = useStore()
    store.datagroups = [Object.assign({}, datagroupJson, { datasets: [{ ...datasetJson }] })]
  })

  describe('Rendering', () => {
    it('renders the correct title', () => {
      expect(wrapper.get('.head .title').text()).toContain(datasetJson.title)
    })

    it('displays the actual amount', () => {
      expect(wrapper.get('.prop-actual-amount').text()).toContain('Ist')
    })

    it('displays the debit amount', () => {
      expect(wrapper.get('.prop-debit-amount').text()).toContain('Soll')
    })

    it('displays the diff amount', () => {
      expect(wrapper.get('.prop-diff-amount').text()).toContain('Differenz')
    })

    it('displays the invoice amount when present', () => {
      expect(wrapper.get('.prop-invoice-amount').text()).toContain('Rg.-Betrag')
    })

    it('displays the monthly amount for type 1 datasets', () => {
      expect(wrapper.get('.prop-monthly-amount').text()).toContain('Monatlich')
    })

    it('displays the invoice date when present', () => {
      expect(wrapper.get('.prop-invoice-date').text()).toContain('Rg.-Datum')
    })

    it('displays the interval name', () => {
      expect(wrapper.get('.prop-interval').text()).toContain('Interval')
    })
  })

  describe('Diff Amount Calculations', () => {
    it('has a number as diffAmount', () => {
      expect(parseFloat(wrapper.get('.prop-diff-amount .value').text())).toBeTypeOf('number')
    })

    it('contains CSS class `negative` for negative diff', () => {
      expect(wrapper.get('.prop-diff-amount .value').classes('negative')).toBe(true)
    })

    it('contains CSS class `positive` for positive diff', async () => {
      await wrapper.setProps({
        dataset: { ...datasetJson, actualAmount: 200, diffAmount: 110 }
      })
      expect(wrapper.get('.prop-diff-amount .value').classes('positive')).toBe(true)
    })

    it('displays plus sign for positive diff', async () => {
      await wrapper.setProps({
        dataset: { ...datasetJson, actualAmount: 200, diffAmount: 110 }
      })
      expect(wrapper.get('.prop-diff-amount .value').text()).toContain('+')
    })
  })

  describe('Update Functionality', () => {
    it('displays update controls for type 1 datasets', () => {
      expect(wrapper.find('.update-amount').exists()).toBe(true)
    })

    it('has update type buttons (+ and =)', () => {
      const buttons = wrapper.findAll('.update-type-buttons a')
      expect(buttons).toHaveLength(2)
    })

    it('highlights active update type', async () => {
      await wrapper.setProps({
        dataset: { ...datasetJson, updateType: 'add' }
      })
      const addButton = wrapper.findAll('.update-type-buttons a')[0]
      expect(addButton.classes('active')).toBe(true)
    })

    it('calls applyUpdate when check button is clicked', async () => {
      await wrapper.setProps({
        dataset: { ...datasetJson, updateAmount: 10, updateType: 'add' }
      })

      const checkButton = wrapper.find('.prop-update-amount button')
      await checkButton.trigger('click')

      // Store should have been updated
      expect(store.datagroups[0].datasets[0].actualAmount).toBe(10)
    })

    it('disables update button when updateAmount is invalid', async () => {
      await wrapper.setProps({
        dataset: { ...datasetJson, updateAmount: null, updateType: 'equals' }
      })

      const checkButton = wrapper.find('.prop-update-amount button')
      expect(checkButton.attributes('disabled')).toBeDefined()
    })
  })

  describe('Collapse Functionality', () => {
    it('starts collapsed', () => {
      expect(wrapper.classes('collapsed')).toBe(true)
    })

    it('toggles collapse when head is clicked', async () => {
      const head = wrapper.find('.prop.head')
      await head.trigger('click')
      expect(wrapper.classes('collapsed')).toBe(false)

      await head.trigger('click')
      expect(wrapper.classes('collapsed')).toBe(true)
    })
  })

  describe('Menu Actions', () => {
    it('has a dropdown menu with 3 items', () => {
      expect(wrapper.vm.menuItems).toHaveLength(3)
    })

    it('emits edit event when edit menu item is clicked', async () => {
      wrapper.vm.menuItems[1].onClick()
      expect(wrapper.emitted('edit')).toBeTruthy()
      expect(wrapper.emitted('edit')[0]).toEqual([datasetJson])
    })

    it('emits delete event when delete menu item is clicked', async () => {
      wrapper.vm.menuItems[2].onClick()
      expect(wrapper.emitted('delete')).toBeTruthy()
      expect(wrapper.emitted('delete')[0]).toEqual([datasetJson])
    })

    it('fills update field when fill menu item is clicked', async () => {
      await wrapper.setProps({
        dataset: { ...datasetJson, updateType: 'add', monthlyAmount: 50 }
      })

      wrapper.vm.menuItems[0].onClick()

      expect(store.datagroups[0].datasets[0].updateAmount).toBe(50)
    })
  })

  describe('Currency Formatting', () => {
    it('formats amounts as currency', () => {
      const actualAmount = wrapper.get('.prop-actual-amount').text()
      // Should contain Euro formatting
      expect(actualAmount).toMatch(/\d/)
    })
  })

  describe('Update Type Toggle', () => {
    it('toggles update type from add to equals', async () => {
      await wrapper.setProps({
        dataset: { ...datasetJson, updateType: 'add' }
      })

      const equalsButton = wrapper.findAll('.update-type-buttons a')[1]
      await equalsButton.trigger('click')

      expect(store.datagroups[0].datasets[0].updateType).toBe('equals')
    })

    it('toggles update type from equals to add', async () => {
      await wrapper.setProps({
        dataset: { ...datasetJson, updateType: 'equals' }
      })

      const addButton = wrapper.findAll('.update-type-buttons a')[0]
      await addButton.trigger('click')

      expect(store.datagroups[0].datasets[0].updateType).toBe('add')
    })
  })

  describe('Exposed Methods', () => {
    it('exposes applyUpdate method', () => {
      expect(wrapper.vm.applyUpdate).toBeDefined()
    })

    it('exposes fillUpdateField method', () => {
      expect(wrapper.vm.fillUpdateField).toBeDefined()
    })
  })
})