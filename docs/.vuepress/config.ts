import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'
import { path } from '@vuepress/utils'

import { navbar, sidebar } from './configs'

const isProd = process.env.NODE_ENV === 'production'

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'en-US',
  title: 'Go Redis',
  description: 'Golang client for Redis Server and Redis Cluster',

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
    require('./uptrace-plugin'),
  ],
  clientAppEnhanceFiles: path.resolve(__dirname, './clientAppEnhance.ts'),
})
