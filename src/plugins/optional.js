export async function registerOptional(app) {
  const { default: pinia } = await import('@/stores')
  
  app.use(pinia)
}
