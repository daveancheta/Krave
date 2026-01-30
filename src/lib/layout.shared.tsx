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
            description: 'Learn to use Fumadocs',
            url: '/docs',
          },
        ],
      },
    ],
    githubUrl: 'https://github.com/daveancheta/Krave',
  };
}
