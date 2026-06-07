import DashboardNav from './DashboardNav';
import DashboardProfileCard from './DashboardProfileCard';
import { BlogInfo } from '@/types/api/blogs';

interface DashboardSidebarProps {
  blogInfos: BlogInfo[] | null;
}

/**
 * Desktop-only sidebar: two stacked cards on the gray page background —
 * a profile card (avatar/nickname/blog address) and the management menu.
 * On mobile the same composition is served by DashboardMobileNav (header Sheet).
 */
export default function DashboardSidebar({ blogInfos }: DashboardSidebarProps) {
  const firstBlogSlug = blogInfos && blogInfos.length > 0 ? blogInfos[0].slug : null;

  return (
    <aside className="hidden w-64 space-y-4 self-start md:block">
      <div className="rounded-lg border bg-white shadow-sm">
        <DashboardProfileCard blogSlug={firstBlogSlug} />
      </div>

      <div className="rounded-lg border bg-white pb-4 shadow-sm">
        <DashboardNav blogSlug={firstBlogSlug} />
      </div>
    </aside>
  );
}
