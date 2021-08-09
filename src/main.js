import { createApp } from 'vue'
import router from "./router"
import App from './App.vue'

// tailwind css
import './index.css'



const app = createApp(App)
app.use(router)
app.mount('#app')