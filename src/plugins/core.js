import vuetify from './vuetify'
import router from '@/router'

export function registerCore(app) {
  app.use(vuetify)
  app.use(router)
}
