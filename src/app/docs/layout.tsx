import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      sidebar={{
        className: 'docs-sidebar',
        defaultOpenLevel: 1,
        banner: <p className="docs-sidebar-label">Sections</p>,
      }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
