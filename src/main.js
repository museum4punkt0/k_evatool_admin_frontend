import { createApp } from 'vue'
import router from './router/router'
import store from './store/store'
import i18n from './i18n/i18n'
import App from './App.vue'
import addFontAwesomeIcons from './icons/fa'

// tailwind css
import './index.css'

const app = createApp(App)
addFontAwesomeIcons(app)

app.use(router)
app.use(store)
app.use(i18n)
app.mount('#app')
