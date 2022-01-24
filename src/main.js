import { createApp } from 'vue'
import router from './router/router'
import store from './store/store'
import i18n from './i18n/i18n'
import App from './App.vue'
import VueTippy from 'vue-tippy'

// tailwind css
import './index.css'

import 'tippy.js/dist/tippy.css' // optional for styling

// axios
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL_API
axios.defaults.headers.Accept = 'application/json'

axios.interceptors.request.use((request) => {
    return request
})

axios.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        let message = 'Bitte wenden Sie sich an den Administrator.\n\n'
        message += 'Bitte wenden Sie sich an den Administrator.\n\n'
        message += `data: ${JSON.stringify(error.response.data)}\n`
        message += `config.url: ${error.response.config.url}\n`
        message += `config.data: ${error.response.config.data}\n`
        message += `error: ${error}\n`
        alert(message)
    },
)

const app = createApp(App)

app.use(router)
app.use(store)
app.use(i18n)

app.use(
    VueTippy,
    // optional
    {
        directive: 'tippy', // => v-tippy
        component: 'tippy', // => <tippy/>
        componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
        defaultProps: {
            placement: 'auto-end',
            allowHTML: true,
            delay: [500, 0],
        }, // => Global default options * see all props
        popperOptions: {
            strategy: 'fixed',
            modifiers: [
                {
                    name: 'flip',
                    options: {
                        fallbackPlacements: ['bottom', 'right'],
                    },
                },
                {
                    name: 'preventOverflow',
                    options: {
                        altAxis: true,
                        tether: false,
                    },
                },
            ],
        },
    },
)

app.mount('#app')
