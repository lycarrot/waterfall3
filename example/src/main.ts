import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import  waterFall3  from "../../src/";

const app=createApp(App)
app.use(waterFall3)

app.mount('#app')
