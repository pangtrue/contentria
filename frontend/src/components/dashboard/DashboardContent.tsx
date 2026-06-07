'use client';

import {
  useDashboadStatsQuery,
  usePopularPostsQuery,
  useTrafficChartQuery,
} from '@/hooks/queries/useDashboardQueries';
import Link from 'next/link';
import PopularPostList from './PopularPostList';
import { ArrowRight, Eye, FileText, Loader2, MessageSquare } from 'lucide-react';
import TrafficChart from './TrafficChart';
import StatCard from './StatCard';
import { User } from '@/types/api/user';
import { BlogInfo } from '@/types/api/blogs';
import { formatTrend } from '@/lib/utils';

interface DashboardContentProps {
  user: User | null;
  blogInfos: BlogInfo[] | null;
}

export default function DashboardContent({ user, blogInfos }: DashboardContentProps) {
  const slug = blogInfos?.[0]?.slug;

  const { data: stats } = useDashboadStatsQuery(slug!);
  const { data: popularPosts } = usePopularPostsQuery(slug!);
  // 기간 선택 없이 최근 30일 고정
  const { data: trafficChart, isFetching: isTrafficFetching } = useTrafficChartQuery(
    slug!,
    '30days'
  );

  const todayTrend = formatTrend(stats?.todayVisitorsGrowthRate);
  const todayViewsTrend = formatTrend(stats?.todayViewsGrowthRate);

  return (
    <div className="space-y-6">
      {/* 환영 헤더 — 글쓰기 CTA는 페이지가 아니라 상단 헤더에 일원화돼 있다 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">블로그관리 홈</h1>
        <p className="mt-1 text-sm text-gray-500">
          안녕하세요, {user?.nickname || '관리자'}님! 오늘의 블로그 현황입니다.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <>
          <StatCard
            icon={<FileText size={24} />}
            title="오늘 방문자"
            value={stats?.todayVisitors ?? 0}
            trend={todayTrend.text}
            trendUp={todayTrend.isUp}
          />
          <StatCard
            icon={<FileText size={24} />}
            title="오늘 조회수"
            value={stats?.todayViews ?? 0}
            trend={todayViewsTrend.text}
            trendUp={todayViewsTrend.isUp}
          />
          <StatCard
            icon={<Eye size={24} />}
            title="전체 조회수"
            value={stats?.totalViews ?? 0}
            trend=""
            trendUp={true}
          />
          <StatCard
            icon={<MessageSquare size={24} />}
            title="전체 게시글 수"
            value={stats?.totalPosts ?? 0}
            trend=""
            trendUp={true}
          />
        </>
      </div>

      {/* 트래픽 차트 — 전체 폭 */}
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-baseline gap-2">
          <h2 className="text-lg font-semibold">트래픽 현황</h2>
          <span className="text-sm text-gray-400">최근 30일</span>
        </div>
        {isTrafficFetching ? (
          <div className="flex h-[280px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <TrafficChart data={trafficChart || []} />
        )}
      </div>

      {/* 인기 글 — 다음 행 */}
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">인기 게시글</h2>
          <Link href="/dashboard/posts" className="text-sm text-indigo-600 hover:text-indigo-800">
            전체보기
          </Link>
        </div>
        <PopularPostList posts={popularPosts || []} />
        <Link
          href="/dashboard/posts"
          className="mt-4 flex items-center justify-center text-sm text-indigo-600 hover:text-indigo-800"
        >
          모든 게시글 보기 <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  );
}
