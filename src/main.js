import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import router from './router/router'
import store from './store/store'
import App from './App.vue'

import messages from './localizations'

// tailwind css
import './index.css'

const app = createApp(App)
const i18n = createI18n({
    locale: 'en',
    messages,
})

app.use(router)
app.use(store)
app.use(i18n)
app.mount('#app')
