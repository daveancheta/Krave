import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="brand-wordmark text-foreground">krave</span>
      ),
    },
    githubUrl: 'https://github.com/daveancheta/Krave',
  };
}
