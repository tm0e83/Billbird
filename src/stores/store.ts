import { defineStore } from 'pinia'
import type { Dataset, Datagroup } from '@/types/index.d'

export interface StoreState {
  alphavantage: any
  currentDate: Date
  datagroups: Datagroup[]
  uid: string | null
}

const getAllDatasets = (datagroups: Datagroup[]): Dataset[] => {
  return datagroups.reduce((datasets, datagroup) => datasets.concat(datagroup.datasets), [] as Dataset[])
}

const getAllActiveDatasets = (state: StoreState): Dataset[] => {
  return state.datagroups.reduce((datasets, datagroup) => {
    return datagroup.active ? datasets.concat(datagroup.datasets) : datasets
  }, [] as Dataset[])
}

export const useStore = defineStore({
  id: 'general',

  state: (): StoreState => ({
    alphavantage: {} as any,
    currentDate: new Date(),
    datagroups: [],
    uid: null
  }),

  getters: {
    isLoggedIn(): boolean {
      return this.uid !== 'testuser'
    },

    allDatasets(state): Dataset[] {
      return getAllDatasets(state.datagroups)
    },

    nextDatagroupId(state): number {
      if (!state.datagroups.length) return 1
      return Math.max(...state.datagroups.map((datagroup) => datagroup.id ?? 0)) + 1
    },

    nextDatasetId(state): number {
      const allDatasets = getAllDatasets(state.datagroups)
      if (!allDatasets.length) return 1
      return Math.max(...allDatasets.map((dataset) => dataset.id ?? 0)) + 1
    },

    totalInvoiceAmount(state): number {
      return getAllActiveDatasets(state).reduce((sum, dataset) => {
        return dataset.invoiceAmount ? (sum += dataset.invoiceAmount) : sum
      }, 0)
    },

    totalMonthlyAmount(state): number {
      return getAllActiveDatasets(state).reduce((sum, dataset) => {
        return dataset.monthlyAmount ? (sum += dataset.monthlyAmount) : sum
      }, 0)
    },

    totalActualAmount(state): number {
      return getAllActiveDatasets(state).reduce((sum, dataset) => {
        return dataset.actualAmount ? (sum += dataset.actualAmount) : sum
      }, 0)
    },

    totalDebitAmount(state): number {
      return getAllActiveDatasets(state).reduce((sum, dataset) => {
        return dataset.debitAmount ? (sum += dataset.debitAmount) : sum
      }, 0)
    },

    totalDiffAmount(state): number {
      return getAllActiveDatasets(state).reduce((sum, dataset) => {
        return dataset.diffAmount ? (sum += dataset.diffAmount) : sum
      }, 0)
    },

    totalUpdateAmount(state): number {
      return getAllActiveDatasets(state).reduce((sum, dataset) => {
        return dataset.updateAmount ? (sum += dataset.updateAmount) : sum
      }, 0)
    }
  },

  actions: {
    addDataset(dataset: Dataset) {
      this.datagroups.forEach((datagroup) => {
        if (datagroup.id === dataset.groupId) datagroup.datasets.push(dataset)
      })
    },

    addDatagroup(datagroup: Datagroup) {
      this.datagroups.push(datagroup)
    },

    deleteDataset(dataset: Dataset) {
      this.datagroups.forEach((datagroup) => {
        if (datagroup.id === dataset.groupId) {
          datagroup.datasets = datagroup.datasets.filter(
            (currentDataset) => currentDataset.id !== dataset.id
          )
        }
      })
    },

    deleteDatagroup(id: number) {
      this.datagroups = this.datagroups.filter((datagroup) => datagroup.id !== id)
    },

    addActualAmount(id: number, amount: number) {
      this.datagroups.forEach((datagroup) => {
        datagroup.datasets.filter((d) => d.id === id).forEach((d) => (d.actualAmount += amount ?? 0))
      })
    },

    setActualAmount(id: number, amount: number) {
      this.datagroups.forEach((datagroup) => {
        datagroup.datasets.filter((d) => d.id === id).forEach((d) => (d.actualAmount = amount ?? 0))
      })
    },

    setDebitAmount(id: number, amount: number) {
      this.datagroups.forEach((datagroup) => {
        datagroup.datasets.filter((d) => d.id === id).forEach((d) => (d.debitAmount = amount ?? 0))
      })
    },

    setDiffAmount(id: number, amount: number) {
      this.datagroups.forEach((datagroup) => {
        datagroup.datasets.filter((d) => d.id === id).forEach((d) => (d.diffAmount = amount))
      })
    },

    setInvoiceDate(id: number, dateStr: string) {
      this.datagroups.forEach((datagroup) => {
        datagroup.datasets.filter((d) => d.id === id).forEach((d) => (d.invoiceDate = dateStr))
      })
    },

    setLastInvoiceDate(id: number, dateStr: string) {
      this.datagroups.forEach((datagroup) => {
        datagroup.datasets.filter((d) => d.id === id).forEach((d) => (d.lastInvoiceDate = dateStr))
      })
    },

    setMonthlyAmount(id: number, amount: number) {
      this.datagroups.forEach((datagroup) => {
        datagroup.datasets.filter((d) => d.id === id).forEach((d) => (d.monthlyAmount = amount ?? 0))
      })
    },

    setUpdateAmount(id: number, amount: number | null) {
      this.datagroups.forEach((datagroup) => {
        datagroup.datasets.filter((d) => d.id === id).forEach((d) => (d.updateAmount = amount ?? null))
      })
    },

    setUpdateType(id: number, updateType: string) {
      this.datagroups.forEach((datagroup) => {
        datagroup.datasets.filter((d) => d.id === id).forEach((d) => (d.updateType = updateType))
      })
    },

    replaceDatagroup(datagroup: Datagroup) {
      this.datagroups = this.datagroups.map((currentDatagroup) => {
        return currentDatagroup.id === datagroup.id ? datagroup : currentDatagroup
      })
    },

    replaceDataset(dataset: Dataset) {
      this.datagroups.forEach((datagroup) => {
        datagroup.datasets.forEach((set, idx) => {
          if (set.id === dataset.id) {
            if (datagroup.id === dataset.groupId) {
              datagroup.datasets.splice(idx, 1, dataset)
            } else {
              datagroup.datasets.splice(idx, 1)

              this.datagroups.forEach((dg) => {
                if (dg.id === dataset.groupId) {
                  dg.datasets.unshift(dataset)
                }
              })
            }
          }
        })
      })
    },

    activateDatagroup(id: number) {
      this.datagroups.forEach((datagroup) => {
        if (datagroup.id === id) {
          datagroup.active = true
        }
      })
    },

    deactivateDatagroup(id: number) {
      this.datagroups.forEach((datagroup) => {
        if (datagroup.id === id) {
          datagroup.active = false
        }
      })
    }
  }
})
