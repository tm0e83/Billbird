import { defineStore } from 'pinia';

const getAllDatasets = datagroups => {
  return datagroups.reduce((datasets, datagroup) => datasets.concat(datagroup.datasets), []);
};

/**
 *
 * @param {*} state
 * @returns
 */
const getAllActiveDatasets = state => {
  return state.datagroups.reduce((datasets, datagroup) => {
    return datagroup.active ? datasets.concat(datagroup.datasets) : datasets;
  }, []);
};

export const useStore = defineStore({
  id: 'general',

  state: () => ({
    alphavantage: {},
    currentDate: new Date(),
    datagroups: [],
    uid: null,
    // hasUnsavedData: false,
    // isTouchDevice: false,
  }),

  getters: {
    isLoggedIn(state) {
      return this.uid !== 'testuser';
    },

    allDatasets(state) {
      return getAllDatasets(state.datagroups);
    },

    nextDatagroupId(state) {
      if (!state.datagroups.length) return 1;
      return Math.max(...state.datagroups.map(datagroup => datagroup.id)) + 1;
    },

    nextDatasetId(state) {
      const allDatasets = this.allDatasets;
      if (!allDatasets.length) return 1;
      return Math.max(...allDatasets.map(dataset => dataset.id)) + 1;
    },

    totalInvoiceAmount(state) {
      return getAllActiveDatasets(state).reduce((sum, dataset) => {
        return dataset.invoiceAmount ? (sum += dataset.invoiceAmount) : sum;
      }, 0);
    },

    totalMonthlyAmount(state) {
      return getAllActiveDatasets(state).reduce((sum, dataset) => {
        return dataset.monthlyAmount ? (sum += dataset.monthlyAmount) : sum;
      }, 0);
    },

    totalActualAmount(state) {
      return getAllActiveDatasets(state).reduce((sum, dataset) => {
        return dataset.actualAmount ? (sum += dataset.actualAmount) : sum;
      }, 0);
    },

    totalDebitAmount(state) {
      return getAllActiveDatasets(state).reduce((sum, dataset) => {
        return dataset.debitAmount ? (sum += dataset.debitAmount) : sum;
      }, 0);
    },

    totalDiffAmount(state) {
      return getAllActiveDatasets(state).reduce((sum, dataset) => {
        return dataset.diffAmount ? (sum += dataset.diffAmount) : sum;
      }, 0);
    },

    totalUpdateAmount(state) {
      return getAllActiveDatasets(state).reduce((sum, dataset) => {
        return dataset.updateAmount ? (sum += dataset.updateAmount) : sum;
      }, 0);
    },
  },

  actions: {
    addDataset(dataset) {
      this.datagroups.map(datagroup => {
        if (datagroup.id === dataset.groupId) datagroup.datasets.push(dataset);
      });
    },

    addDatagroup(datagroup) {
      this.datagroups.push(datagroup);
    },

    deleteDataset(dataset) {
      this.datagroups.map(datagroup => {
        if (datagroup.id === dataset.groupId) {
          datagroup.datasets = datagroup.datasets.filter(currentDataset => currentDataset.id !== dataset.id);
        }
      });
    },

    deleteDatagroup(id) {
      this.datagroups = this.datagroups.filter(datagroup => datagroup.id !== id);
    },

    addActualAmount(id, amount) {
      this.datagroups.map(datagroup => {
        datagroup.datasets.filter(d => d.id === id).map(d => (d.actualAmount += amount ?? 0));
      });
    },

    setActualAmount(id, amount) {
      this.datagroups.map(datagroup => {
        datagroup.datasets.filter(d => d.id === id).map(d => (d.actualAmount = amount ?? 0));
      });
    },

    setDebitAmount(id, amount) {
      this.datagroups.map(datagroup => {
        datagroup.datasets.filter(d => d.id === id).map(d => (d.debitAmount = amount ?? 0));
      });
    },

    setDiffAmount(id, amount) {
      this.datagroups.map(datagroup => {
        datagroup.datasets.filter(d => d.id === id).map(d => (d.diffAmount = amount));
      });
    },

    setInvoiceDate(id, dateStr) {
      this.datagroups.map(datagroup => {
        datagroup.datasets.filter(d => d.id === id).map(d => (d.invoiceDate = dateStr));
      });
    },

    setLastInvoiceDate(id, dateStr) {
      this.datagroups.map(datagroup => {
        datagroup.datasets.filter(d => d.id === id).map(d => (d.lastInvoiceDate = dateStr));
      });
    },

    setMonthlyAmount(id, amount) {
      this.datagroups.map(datagroup => {
        datagroup.datasets.filter(d => d.id === id).map(d => (d.monthlyAmount = amount ?? 0));
      });
    },

    setUpdateAmount(id, amount) {
      this.datagroups.map(datagroup => {
        datagroup.datasets.filter(d => d.id === id).map(d => (d.updateAmount = amount ?? 0));
      });
    },

    setUpdateType(id, updateType) {
      this.datagroups.map(datagroup => {
        datagroup.datasets.filter(d => d.id === id).map(d => (d.updateType = updateType));
      });
    },

    replaceDatagroup(datagroup) {
      this.datagroups = this.datagroups.map(currentDatagroup => {
        return currentDatagroup.id === datagroup.id ? datagroup : currentDatagroup;
      });
    },

    replaceDataset(dataset) {
      this.datagroups.map(datagroup => {
        datagroup.datasets.map((set, idx) => {
          if (set.id === dataset.id) {
            if (datagroup.id === dataset.groupId) {
              datagroup.datasets.splice(idx, 1, dataset);
            } else {
              datagroup.datasets.splice(idx, 1);

              this.datagroups.map(datagroup => {
                if (datagroup.id === dataset.groupId) {
                  datagroup.datasets.unshift(dataset);
                }
              });
            }
          }
        });
      });
    },

    activateDatagroup(id) {
      this.datagroups.map(datagroup => {
        if (datagroup.id === id) {
          datagroup.active = true;
        }
      });
      // this.inactiveDatagroupIds.splice(this.inactiveDatagroupIds.indexOf(id), 1);
    },

    deactivateDatagroup(id) {
      this.datagroups.map(datagroup => {
        if (datagroup.id === id) {
          datagroup.active = false;
        }
      });
      // this.inactiveDatagroupIds.push(id);
    },
  },
});
