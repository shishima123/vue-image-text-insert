import './assets/main.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ToastService from 'primevue/toastservice'
import 'primeicons/primeicons.css'
import App from './App.vue'

const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})
app.use(ToastService)

app.mount('#app')
