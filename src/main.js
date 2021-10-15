import { createApp } from 'vue'
import router from './router/router'
import store from './store/store'
import i18n from './i18n/i18n'
import App from './App.vue'

// tailwind css
import './index.css'

// axios
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL_API
axios.defaults.headers.Accept = 'application/json'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(i18n)

app.mount('#app')
