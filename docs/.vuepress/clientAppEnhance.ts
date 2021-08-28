import { defineClientAppEnhance } from '@vuepress/client'

export default defineClientAppEnhance(({ router }) => {
  router.addRoute({ path: '/cluster', redirect: '/guide/cluster.html' })
  router.addRoute({ path: '/sentinel', redirect: '/guide/sentinel.html' })
  router.addRoute({ path: '/ring', redirect: '/guide/ring.html' })
  router.addRoute({ path: '/universal', redirect: '/guide/universal.html' })
  router.addRoute({ path: '/tracing', redirect: '/guide/tracing.html' })
  router.addRoute({ path: '/caching', redirect: '/guide/caching.html' })
  router.addRoute({ path: '/rate-limiting', redirect: '/guide/rate-limiting.html' })
  router.addRoute({ path: '/get-all-keys', redirect: '/guide/get-all-keys.html' })
})
