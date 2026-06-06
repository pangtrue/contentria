'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, FolderTree, Home, LayoutDashboard, Settings } from 'lucide-react';
import SidebarMenuItem from './DashboardSidebarMenuItem';

interface DashboardNavProps {
  blogSlug: string | null;
  /** 모바일 Sheet에서 메뉴 클릭 시 드로어를 닫기 위한 콜백 */
  onNavigate?: () => void;
}

const navItems = [
  {
    path: '/dashboard',
    label: '대시보드',
    icon: <LayoutDashboard size={20} />,
    requiresBlog: false,
  },
  {
    path: '/dashboard/posts',
    label: '글 관리',
    icon: <FileText size={20} />,
    requiresBlog: true,
  },
  {
    path: '/dashboard/categories',
    label: '카테고리 관리',
    icon: <FolderTree size={20} />,
    requiresBlog: true,
  },
  {
    path: '/dashboard/settings',
    label: '설정',
    icon: <Settings size={20} />,
    requiresBlog: true,
  },
];

/** 데스크톱 사이드바와 모바일 Sheet가 공유하는 대시보드 내비게이션. */
export default function DashboardNav({ blogSlug, onNavigate }: DashboardNavProps) {
  const pathname = usePathname();
  const isBlogLinkActive = blogSlug !== null;

  return (
    <>
      <div className="p-4">
        <Link
          href={blogSlug ? `/@${blogSlug}` : '/dashboard'}
          target={isBlogLinkActive ? '_blank' : '_self'}
          onClick={onNavigate}
          className="flex items-center rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100"
        >
          <Home size={20} className="mr-3" />
          <span>블로그로 돌아가기</span>
        </Link>
      </div>

      <nav className="mt-2 px-3">
        <p className="mb-2 px-3 text-xs font-semibold uppercase text-gray-500">관리 메뉴</p>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <SidebarMenuItem
                path={item.path}
                label={item.label}
                icon={item.icon}
                isActive={pathname === item.path}
                disabled={item.requiresBlog && !blogSlug}
                onClick={onNavigate}
              />
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
