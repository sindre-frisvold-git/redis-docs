import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'
import { path } from '@vuepress/utils'

import { navbar, sidebar } from './configs'

const isProd = process.env.NODE_ENV === 'production'

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'en-US',
  title: 'Go Redis',
  description: 'Golang Redis client for Redis Server and Redis Cluster',

  theme: path.resolve(__dirname, './theme'),
  themeConfig: {
    logo: '/favicon-32x32.png',
    darkMode: false,
    contributors: false,

    locales: {
      '/': {
        navbar: navbar.en,
        sidebar: sidebar.en,
        editLinkText: 'Edit this page on GitHub',
      },
    },
  },
  alias: {
    '@public': path.resolve(__dirname, './public'),
  },

  evergreen: isProd,
  bundler: '@vuepress/bundler-webpack',
  bundlerConfig: {
    configureWebpack: (config) => {
      config.module.rules.push({
        test: /\.mjs$/i,
        resolve: { byDependency: { esm: { fullySpecified: false } } },
      })
      return {}
    },
  },

  markdown: {
    code: {
      lineNumbers: false,
    },
  },

  plugins: [
    ['@vuepress/plugin-google-analytics', { id: 'G-WS7W97P9KS' }],
    [
      '@vuepress/plugin-register-components',
      {
        componentsDir: path.resolve(__dirname, './components'),
      },
    ],
    ['@vuepress/plugin-search'],
    ['vuepress-plugin-sitemap2', { hostname: 'https://redis.uptrace.dev' }],
    [
      'vuepress-plugin-seo2',
      {
        hostname: 'https://redis.uptrace.dev',
        canonical(page) {
          return 'https://redis.uptrace.dev' + page.path
        },
      },
    ],
    [
      'vuepress-plugin-redirect2',
      {
        hostname: 'https://redis.uptrace.dev',
        config: {
          //'/cluster/index.html': '/guide/go-redis-cluster.html',
          // '/sentinel/index.html': '/guide/go-redis-sentinel.html',
          // '/ring/index.html': '/guide/ring.html',
          // '/universal/index.html': '/guide/universal.html',
          // '/tracing/index.html': '/guide/redis-performance-monitoring.html',
          // '/caching/index.html': '/guide/go-redis-cache.html',
          // '/rate-limiting/': '/guide/go-redis-rate-limiting.html',
          // '/get-all-keys/': '/guide/get-all-keys.html',

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
        },
      },
    ],
    require('./uptrace-plugin'),
  ],
  clientAppEnhanceFiles: path.resolve(__dirname, './clientAppEnhance.ts'),
})
