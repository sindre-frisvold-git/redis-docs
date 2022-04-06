import { defineClientAppEnhance } from '@vuepress/client'

import {
  ElIcon,
  ElTag,

  //
  ElCard,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
} from 'element-plus'

import 'element-plus/es/components/icon/style/css.mjs'
import 'element-plus/es/components/tag/style/css.mjs'

import 'element-plus/es/components/card/style/css.mjs'
import 'element-plus/es/components/form/style/css.mjs'
import 'element-plus/es/components/form-item/style/css.mjs'
import 'element-plus/es/components/input/style/css.mjs'
import 'element-plus/es/components/button/style/css.mjs'

export default defineClientAppEnhance(({ app, router }) => {
  app.use(ElIcon)
  app.use(ElTag)

  app.use(ElCard)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElInput)
  app.use(ElButton)

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
