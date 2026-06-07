'use client';

import Link from 'next/link';
import UserAvatar from '@/components/dashboard/header/UserAvatar';
import { useUserProfile } from '@/hooks/queries/useUserQuery';

interface DashboardProfileCardProps {
  blogSlug: string | null;
}

/**
 * 사이드바 상단 프로필 카드: 프로필 이미지 + 닉네임 + 블로그 주소.
 * 주소 클릭 시 (기존 '블로그로 돌아가기'처럼) 내 블로그를 새 탭으로 연다.
 */
export default function DashboardProfileCard({ blogSlug }: DashboardProfileCardProps) {
  const { data: user } = useUserProfile();

  return (
    <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-gray-200">
        <UserAvatar user={user} size={52} />
      </div>

      <p className="max-w-full truncate text-sm font-semibold text-gray-900">{user?.nickname}</p>

      {blogSlug && (
        <Link
          href={`/@${blogSlug}`}
          target="_blank"
          className="max-w-full truncate text-xs text-muted-foreground hover:text-primary hover:underline"
        >
          contentria.com/@{blogSlug}
        </Link>
      )}
    </div>
  );
}
