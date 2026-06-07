export interface StatsResponse {
  todayVisitors: number;
  todayVisitorsGrowthRate: number | null;
  todayViews: number;
  todayViewsGrowthRate: number | null;
  totalViews: number;
  totalPosts: number;
}

export interface PopularPostResponse {
  id: string;
  title: string;
  views: number;
}

export type TimeRange = '2weeks' | '30days' | '90days';

export interface TrafficChartResponse {
  /** 30days 범위에서는 ISO(yyyy-MM-dd) — 차트가 일/월 축 라벨을 직접 구성한다 */
  date: string;
  visitors: number;
  views: number;
}
