import type { SidebarConfig } from '@vuepress/theme-default'

export const en: SidebarConfig = {
  '/': [
    {
      isGroup: true,
      text: 'Guide',
      children: [
        '/guide/README.md',
        '/guide/server.md',
        '/guide/cluster.md',
        '/guide/sentinel.md',
        '/guide/ring.md',
        '/guide/universal.md',
      ],
    },
    {
      isGroup: true,
      text: 'Tutorial',
      children: [
        '/guide/tracing.md',
        '/guide/caching.md',
        '/guide/rate-limiting.md',
        '/guide/get-all-keys.md',
      ],
    },
  ],
}
