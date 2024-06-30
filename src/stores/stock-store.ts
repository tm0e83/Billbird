import { defineStore } from 'pinia'

export const useStockStore = defineStore({
  id: 'stock',

  state: () => ({
    data: {},
    apiKey: null
  }),

  getters: {
    // isLoggedIn(state) {
    //   return this.uid !== 'testuser';
    // },
  },

  actions: {
    // addDatagroup(datagroup) {
    //   this.datagroups.push(datagroup);
    // },
  }
})
