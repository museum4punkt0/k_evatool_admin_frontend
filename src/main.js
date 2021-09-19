import { createApp } from 'vue'
import router from './router/router'
import store from './store/store'
import i18n from './i18n/i18n'
import App from './App.vue'
// import addFontAwesomeIcons from './icons/fa'
import { DraggablePlugin } from '@braks/revue-draggable'

// tailwind css
import './index.css'

// axios
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL_API

const app = createApp(App)
// addFontAwesomeIcons(app)

app.use(router)
app.use(store)
app.use(i18n)
app.use(DraggablePlugin)
app.mount('#app')
