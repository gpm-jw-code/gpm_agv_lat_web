import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/Styles/global-style.css'
const app = createApp(App)

app.use(router);
app.use(BootstrapVue3);
app.use(ElementPlus, { size: 'default', zIndex: 3000 });
app.mount('#app')
