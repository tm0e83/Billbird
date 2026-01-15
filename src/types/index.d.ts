import type { DefineComponent } from 'vue'

declare module '*.vue' {
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

// Global type definitions
export interface Dataset {
  id: number | null
  title: string
  groupId: number
  interval: string
  type: number
  invoiceAmount: number
  invoiceDate: string | null
  lastInvoiceDate: string | null
  lastUpdateDate: string | null
  monthlyAmount: number
  actualAmount: number
  debitAmount: number
  diffAmount: number
  updateAmount: number | null
  updateType: string
}

export interface Datagroup {
  id: number | null
  title: string
  active: boolean
  datasets: Dataset[]
}

export interface StoreState {
  alphavantage: Record<string, any>
  currentDate: Date
  datagroups: Datagroup[]
  uid: string | null
}
