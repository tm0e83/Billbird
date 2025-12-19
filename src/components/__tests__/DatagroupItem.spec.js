import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { useStore } from '@/stores/store'
import DatagroupItem from '../DatagroupItem.vue'
import datagroupJson from './helper/datagroup.json'
import datasetJson from './helper/dataset.json'

describe('DatagroupItem', () => {
  let wrapper
  let store

  beforeEach(() => {
    const testDatagroup = {
      ...datagroupJson,
      active: true,
      datasets: [{ ...datasetJson }]
    }

    wrapper = mount(DatagroupItem, {
      global: {
        plugins: [createPinia()],
        stubs: {
          DatasetList: true,
          DropdownMenu: true
        }
      },
      props: {
        datagroup: testDatagroup
      }
    })

    store = useStore()
    store.datagroups = [testDatagroup]
  })

  describe('Rendering', () => {
    it('renders the datagroup title', () => {
      expect(wrapper.find('.title-text').text()).toBe(datagroupJson.title)
    })

    it('displays the drag handle button', () => {
      expect(wrapper.find('.drag-handle').exists()).toBe(true)
    })

    it('renders DatasetList component', () => {
      expect(wrapper.findComponent({ name: 'DatasetList' }).exists()).toBe(true)
    })
  })

  describe('Collapse/Expand', () => {
    it('starts collapsed', () => {
      expect(wrapper.classes('collapsed')).toBe(true)
    })

    it('toggles collapsed state when head is clicked', async () => {
      const head = wrapper.find('.head')
      await head.trigger('click')
      expect(wrapper.classes('collapsed')).toBe(false)

      await head.trigger('click')
      expect(wrapper.classes('collapsed')).toBe(true)
    })

    it('does not toggle if datagroup is inactive', async () => {
      await wrapper.setProps({
        datagroup: { ...datagroupJson, active: false, datasets: [{ ...datasetJson }] }
      })

      const head = wrapper.find('.head')
      await head.trigger('click')
      expect(wrapper.classes('collapsed')).toBe(true)
    })

    it('does not toggle when clicking a button', async () => {
      await wrapper.setProps({
        datagroup: { ...datagroupJson, active: true, datasets: [{ ...datasetJson }] }
      })

      const button = wrapper.find('.button.drag-handle')
      await button.trigger('click')
      expect(wrapper.classes('collapsed')).toBe(true)
    })
  })

  describe('Active/Inactive State', () => {
    it('applies inactive class when datagroup is inactive', async () => {
      await wrapper.setProps({
        datagroup: { ...datagroupJson, active: false, datasets: [{ ...datasetJson }] }
      })
      expect(wrapper.classes('inactive')).toBe(true)
    })

    it('does not apply inactive class when datagroup is active', async () => {
      await wrapper.setProps({
        datagroup: { ...datagroupJson, active: true, datasets: [{ ...datasetJson }] }
      })
      expect(wrapper.classes('inactive')).toBe(false)
    })

    it('activate button is shown only when inactive', async () => {
      await wrapper.setProps({
        datagroup: { ...datagroupJson, active: false, datasets: [{ ...datasetJson }] }
      })

      const activateItem = wrapper.vm.menuItems.find(item => item.label === 'Aktivieren')
      expect(activateItem.condition).toBe(true)
    })

    it('deactivate button is shown only when active', async () => {
      await wrapper.setProps({
        datagroup: { ...datagroupJson, active: true, datasets: [{ ...datasetJson }] }
      })

      const deactivateItem = wrapper.vm.menuItems.find(item => item.label === 'Deaktivieren')
      expect(deactivateItem.condition).toBe(true)
    })
  })

  describe('Menu Items', () => {
    it('has 5 menu items', () => {
      expect(wrapper.vm.menuItems).toHaveLength(5)
    })

    it('has correct menu item labels', () => {
      const labels = wrapper.vm.menuItems.map(item => item.label)
      expect(labels).toContain('Ausfüllen')
      expect(labels).toContain('Bearbeiten')
      expect(labels).toContain('Löschen')
      expect(labels).toContain('Aktivieren')
      expect(labels).toContain('Deaktivieren')
    })

    it('emits edit event when edit menu item is clicked', async () => {
      const editItem = wrapper.vm.menuItems.find(item => item.label === 'Bearbeiten')
      editItem.onClick()

      expect(wrapper.emitted('edit')).toBeTruthy()
      expect(wrapper.emitted('edit')[0][0].id).toBe(datagroupJson.id)
    })

    it('emits delete event when delete menu item is clicked', async () => {
      const deleteItem = wrapper.vm.menuItems.find(item => item.label === 'Löschen')
      deleteItem.onClick()

      expect(wrapper.emitted('delete')).toBeTruthy()
      expect(wrapper.emitted('delete')[0][0].id).toBe(datagroupJson.id)
    })
  })

  describe('Total Amounts', () => {
    it('calculates total actual amount correctly', () => {
      expect(wrapper.vm.totalActualAmount).toBe(datasetJson.actualAmount)
    })

    it('calculates total invoice amount correctly', () => {
      expect(wrapper.vm.totalInvoiceAmount).toBe(datasetJson.invoiceAmount)
    })

    it('calculates total debit amount correctly', () => {
      expect(wrapper.vm.totalDebitAmount).toBe(datasetJson.debitAmount)
    })

    it('calculates total diff amount correctly', () => {
      expect(wrapper.vm.totalDiffAmount).toBe(datasetJson.diffAmount)
    })

    it('calculates total monthly amount correctly', () => {
      expect(wrapper.vm.totalMonthlyAmount).toBe(datasetJson.monthlyAmount)
    })

    it('returns 0 for total amounts when datasets are empty', async () => {
      await wrapper.setProps({
        datagroup: { ...datagroupJson, datasets: [] }
      })

      expect(wrapper.vm.totalActualAmount).toBe(0)
      expect(wrapper.vm.totalInvoiceAmount).toBe(0)
      expect(wrapper.vm.totalDebitAmount).toBe(0)
      expect(wrapper.vm.totalDiffAmount).toBe(0)
      expect(wrapper.vm.totalMonthlyAmount).toBe(0)
    })

    it('sums multiple datasets correctly', async () => {
      const dataset2 = { ...datasetJson, id: 2, actualAmount: 100, invoiceAmount: 200 }
      await wrapper.setProps({
        datagroup: { ...datagroupJson, datasets: [{ ...datasetJson }, dataset2] }
      })

      expect(wrapper.vm.totalActualAmount).toBe(datasetJson.actualAmount + dataset2.actualAmount)
      expect(wrapper.vm.totalInvoiceAmount).toBe(datasetJson.invoiceAmount + dataset2.invoiceAmount)
    })
  })

  describe('Diff Amount Styling', () => {
    it('applies positive class for positive diff', async () => {
      await wrapper.setProps({
        datagroup: { ...datagroupJson, datasets: [{ ...datasetJson, diffAmount: 100 }] }
      })

      expect(wrapper.vm.isPositiveDiff).toBe(true)
      expect(wrapper.vm.isNegativeDiff).toBe(false)
    })

    it('applies negative class for negative diff', () => {
      expect(wrapper.vm.isNegativeDiff).toBe(true)
      expect(wrapper.vm.isPositiveDiff).toBe(false)
    })

    it('does not apply positive/negative class when diff is 0', async () => {
      await wrapper.setProps({
        datagroup: { ...datagroupJson, datasets: [{ ...datasetJson, diffAmount: 0 }] }
      })

      expect(wrapper.vm.isPositiveDiff).toBe(false)
      expect(wrapper.vm.isNegativeDiff).toBe(false)
    })
  })

  describe('Update Amounts', () => {
    it('detects when update amounts exist', async () => {
      await wrapper.setProps({
        datagroup: { ...datagroupJson, datasets: [{ ...datasetJson, updateAmount: 50 }] }
      })

      expect(wrapper.vm.hasUpdateAmounts).toBe(true)
    })

    it('detects when no update amounts exist', async () => {
      await wrapper.setProps({
        datagroup: { ...datagroupJson, datasets: [{ ...datasetJson, updateAmount: null }] }
      })

      expect(wrapper.vm.hasUpdateAmounts).toBe(false)
    })

    it('calculates total update amount correctly', async () => {
      await wrapper.setProps({
        datagroup: { ...datagroupJson, datasets: [{ ...datasetJson, updateAmount: 75 }] }
      })

      expect(wrapper.vm.totalUpdateAmount).toBe(75)
    })

    it('sums update amounts from multiple datasets', async () => {
      const dataset2 = { ...datasetJson, id: 2, updateAmount: 30 }
      await wrapper.setProps({
        datagroup: {
          ...datagroupJson,
          datasets: [
            { ...datasetJson, updateAmount: 50 },
            dataset2
          ]
        }
      })

      expect(wrapper.vm.totalUpdateAmount).toBe(80)
    })
  })

  describe('Exposed Methods', () => {
    it('exposes applyUpdate method', () => {
      expect(wrapper.vm.applyUpdate).toBeDefined()
    })

    it('exposes fillUpdateFields method', () => {
      expect(wrapper.vm.fillUpdateFields).toBeDefined()
    })

    it('fillUpdateFields calls datasetListRef.fillUpdateFields', async () => {
      const mockFillUpdateFields = vi.fn()
      wrapper.vm.datasetListRef = { fillUpdateFields: mockFillUpdateFields }

      wrapper.vm.fillUpdateFields()

      expect(mockFillUpdateFields).toHaveBeenCalled()
    })
  })

  describe('Store Integration', () => {
    it('activates datagroup when activate is called', async () => {
      const inactiveDatagroup = { ...datagroupJson, active: false, datasets: [{ ...datasetJson }] }
      store.datagroups = [inactiveDatagroup]

      await wrapper.setProps({
        datagroup: inactiveDatagroup
      })

      const activateItem = wrapper.vm.menuItems.find(item => item.label === 'Aktivieren')
      activateItem.onClick()

      expect(store.datagroups[0].active).toBe(true)
    })

    it('deactivates datagroup when deactivate is called', async () => {
      const activeDatagroup = { ...datagroupJson, active: true, datasets: [{ ...datasetJson }] }
      store.datagroups = [activeDatagroup]

      await wrapper.setProps({
        datagroup: activeDatagroup
      })

      const deactivateItem = wrapper.vm.menuItems.find(item => item.label === 'Deaktivieren')
      deactivateItem.onClick()

      expect(store.datagroups[0].active).toBe(false)
    })

    it('collapses when deactivating', async () => {
      const activeDatagroup = { ...datagroupJson, active: true, datasets: [{ ...datasetJson }] }
      store.datagroups = [activeDatagroup]

      await wrapper.setProps({
        datagroup: activeDatagroup
      })

      wrapper.vm.state.collapsed = false
      const deactivateItem = wrapper.vm.menuItems.find(item => item.label === 'Deaktivieren')
      deactivateItem.onClick()

      expect(wrapper.vm.state.collapsed).toBe(true)
    })
  })
})
