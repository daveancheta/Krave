import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Krave',
    },
     links: [
      {
        type: 'menu',
        text: 'Documentation',
        items: [
          {
            text: 'Getting Started',
            description: 'Learn how to set up your AI API and Frontend',
            url: '/docs',
          },
        ],
      },
    ],
    githubUrl: 'https://github.com/daveancheta/Krave',
  };
}
