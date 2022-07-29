import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'
import { path } from '@vuepress/utils'
const { webpackBundler } = require('@vuepress/bundler-webpack')
const { googleAnalyticsPlugin } = require('@vuepress/plugin-google-analytics')
const { registerComponentsPlugin } = require('@vuepress/plugin-register-components')
const { searchPlugin } = require('@vuepress/plugin-search')
const { sitemapPlugin } = require('vuepress-plugin-sitemap2')
const { seoPlugin } = require('vuepress-plugin-seo2')
const { redirectPlugin } = require('vuepress-plugin-redirect')

import { localTheme } from './theme'
import { navbar, sidebar } from './configs'

const isProd = process.env.NODE_ENV === 'production'

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'en-US',
  title: 'Go Redis',
  description: 'Golang Redis client for Redis Server and Redis Cluster',

  theme: localTheme({
    logo: '/favicon-32x32.png',
    darkMode: false,
    contributors: false,

    navbar: navbar.en,
    sidebar: sidebar.en,

    docsRepo: 'go-redis/redis-docs',
    docsBranch: 'master',
    docsDir: 'docs',
  }),
  alias: {
    '@public': path.resolve(__dirname, './public'),
  },

  evergreen: isProd,
  bundler: webpackBundler({
    configureWebpack: (config) => {
      config.module.rules.push({
        test: /\.mjs$/i,
        resolve: { byDependency: { esm: { fullySpecified: false } } },
      })
      return {}
    },
  }),

  markdown: {
    code: {
      lineNumbers: false,
    },
  },

  plugins: [
    googleAnalyticsPlugin({ id: 'G-WS7W97P9KS' }),
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, './components'),
    }),
    searchPlugin(),
    sitemapPlugin({ hostname: 'https://redis.uptrace.dev' }),
    seoPlugin({
      hostname: 'https://redis.uptrace.dev',
      canonical(page) {
        return 'https://redis.uptrace.dev' + page.path
      },
    }),
    redirectPlugin({
      hostname: 'https://redis.uptrace.dev',
      config: {
        '/cluster/index.html': '/guide/go-redis-cluster.html',
        '/sentinel/index.html': '/guide/go-redis-sentinel.html',
        '/ring/index.html': '/guide/ring.html',
        '/universal/index.html': '/guide/universal.html',
        '/tracing/index.html': '/guide/redis-performance-monitoring.html',
        '/caching/index.html': '/guide/go-redis-cache.html',
        '/rate-limiting/': '/guide/go-redis-rate-limiting.html',
        '/get-all-keys/': '/guide/get-all-keys.html',

        '/guide/cluster.html': '/guide/go-redis-cluster.html',
        '/guide/caching.html': '/guide/go-redis-cache.html',
        '/guide/hll.html': '/guide/go-redis-hll.html',
        '/guide/performance.html': '/guide/go-redis-debugging.html',
        '/guide/pipelines.html': '/guide/go-redis-pipelines.html',
        '/guide/pubsub.html': '/guide/go-redis-pubsub.html',
        '/guide/rate-limiting.html': '/guide/go-redis-rate-limiting.html',
        '/guide/sentinel.html': '/guide/go-redis-sentinel.html',
        '/guide/server.html': '/guide/go-redis.html',
        '/guide/tracing.html': '/guide/redis-performance-monitoring.html',
        '/guide/redis-performance-monitoring.html': '/guide/go-redis-monitoring.html',
      },
    }),
    require('./uptrace-plugin'),
  ],
})
