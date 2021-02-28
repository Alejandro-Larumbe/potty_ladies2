import Router from 'express-promise-router'
const router = Router()
const routes = ['users', 'plants']

for (let route of routes) {
  router.use(`/${route}`, require(`./${route}.ts`))
}

export default router
