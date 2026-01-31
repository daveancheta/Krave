import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Brain } from 'lucide-react';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2">
          <Brain />
          <span className="font-semibold">Krave</span>
        </div>
      ),
    },
    githubUrl: 'https://github.com/daveancheta/Krave',
  };
}
