import Link from 'next/link';
import DashboardNav from './DashboardNav';
import { BlogInfo } from '@/types/api/blogs';

interface DashboardSidebarProps {
  blogInfos: BlogInfo[] | null;
}

/**
 * Desktop-only sidebar. On mobile the same nav is served by DashboardMobileNav —
 * a Sheet whose trigger lives inside the header, so there is no longer a fixed
 * overlay button colliding with the header logo.
 */
export default function DashboardSidebar({ blogInfos }: DashboardSidebarProps) {
  const firstBlogSlug = blogInfos && blogInfos.length > 0 ? blogInfos[0].slug : null;

  return (
    <aside className="hidden w-64 bg-white shadow-lg md:block">
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="text-xl font-bold text-primary">
          블로그 관리
        </Link>
      </div>

      <DashboardNav blogSlug={firstBlogSlug} />
    </aside>
  );
}
