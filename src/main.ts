// import './assets/main.css'

// import { createApp } from 'vue'
// import { createPinia } from 'pinia'

// import App from './App.vue'
// import router from './router'

// const app = createApp(App)

// app.use(createPinia())
// app.use(router)

// app.mount('#app')

import '@vuepic/vue-datepicker/dist/main.css'
import '@/assets/styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import ModalWindow from '@/components/ModalWindow.vue'
import App from './App.vue'
import router from './router'
import Notifications from '@kyvg/vue3-notification'
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyCfxcuq6bDa5rNEhmKKAcH9P6OXYQmwdnc',
  authDomain: 'billbird-2beb9.firebaseapp.com',
  databaseURL: 'https://billbird-2beb9-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'billbird-2beb9',
  storageBucket: 'billbird-2beb9.appspot.com',
  messagingSenderId: '152796681628',
  appId: '1:152796681628:web:a039390076b53776212459'
}

initializeApp(firebaseConfig)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Notifications)

// components
app.component('Datepicker', VueDatePicker)
app.component('ModalWindow', ModalWindow)

app.mount('#app')
