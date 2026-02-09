/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerCore } from '@/plugins/core'
import { registerOptional } from '@/plugins/optional'


// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'


const app = createApp(App)

registerCore(app)
app.mount('#app')

// load heavy stuff AFTER first paint
registerOptional(app)



