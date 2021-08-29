import { defineClientAppEnhance } from '@vuepress/client'

export default defineClientAppEnhance(({ router }) => {
  router.beforeResolve((to, from, next) => {
    const redirectMap = {
      '/cluster/': '/guide/cluster.html',
      '/sentinel/': '/guide/sentinel.html',
      '/ring/': '/guide/ring.html',
      '/universal/': '/guide/universal.html',
      '/tracing/': '/guide/tracing.html',
      '/caching/': '/guide/caching.html',
      '/rate-limiting/': '/guide/rate-limiting.html',
      '/get-all-keys/': '/guide/get-all-keys.html',
    }

    let path = to.path
    if (!path.endsWith('/')) {
      path += '/'
    }

    const redirect = redirectMap[path]
    if (redirect) {
      window.location.href = redirect
    } else {
      next()
    }
  })
})
