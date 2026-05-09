import DashboardContent from '@/components/dashboard/DashboardContent';
import CreateBlogWelcome from '@/components/dashboard/CreateBlogWelcome';
import { getRawUserProfileAction } from '@/actions/user';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import {
  getDashboardStatsAction,
  getPopularPostsAction,
  getTrafficDataAction,
} from '@/actions/dashboard';
import { getMyBlogAction } from '@/actions/blog';
import { getQueryClient } from '@/lib/getQueryClient';

export default async function DashboardPage() {
  const user = await getRawUserProfileAction();
  const blogInfos = await getMyBlogAction();

  if (!blogInfos || blogInfos.length === 0) {
    return <CreateBlogWelcome />;
  }

  const slug = blogInfos[0].slug;
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['dashboard', 'stats', slug],
      queryFn: () => getDashboardStatsAction(slug),
    }),
    queryClient.prefetchQuery({
      queryKey: ['dashboard', 'popularPosts', slug],
      queryFn: () => getPopularPostsAction(slug),
    }),
    queryClient.prefetchQuery({
      queryKey: ['dashboard', 'traffic', slug, '2weeks'],
      queryFn: () => getTrafficDataAction(slug, '2weeks'),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardContent user={user} blogInfos={blogInfos} />
    </HydrationBoundary>
  );
}
