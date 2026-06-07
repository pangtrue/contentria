import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TrafficChartResponse } from '@/types/api/dashboard';

/** 툴팁/월 라벨용 — ISO(yyyy-MM-dd) 날짜를 "6월 24일" 형태로 */
const formatKoreanDate = (iso: string) => {
  const date = new Date(iso);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

interface DayTickProps {
  x?: number;
  y?: number;
  index?: number;
  payload?: { value: string };
}

/**
 * X축 커스텀 틱: "06/24" 식 표기는 30일치가 빡빡해서 일(day) 숫자만 표기하고,
 * 첫 틱과 매월 1일 틱 아래 줄에만 월을 표기한다.
 */
const DayTick = ({ x, y, index, payload }: DayTickProps) => {
  if (!payload) return null;
  const date = new Date(payload.value);
  const day = date.getDate();
  const showMonth = index === 0 || day === 1;

  return (
    <g transform={`translate(${x},${y})`}>
      <text dy={12} textAnchor="middle" fontSize={11} fill="#6b7280">
        {day}
      </text>
      {showMonth && (
        <text dy={28} textAnchor="middle" fontSize={11} fontWeight={600} fill="#374151">
          {date.getMonth() + 1}월
        </text>
      )}
    </g>
  );
};

const TrafficChart = ({ data }: { data: TrafficChartResponse[] }) => {
  // 이틀 간격으로 틱을 두되, 월 라벨이 걸리는 매월 1일은 건너뛰지 않도록 강제 포함
  const ticks = data
    .filter((d, i) => i === 0 || i % 2 === 0 || new Date(d.date).getDate() === 1)
    .map((d) => d.date);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          ticks={ticks}
          interval={0}
          tick={<DayTick />}
          tickLine={false}
          axisLine={{ stroke: '#e5e7eb' }}
        />
        {/* 세로축은 숨긴다(소수점 틱 노이즈 제거) — 수치는 호버 툴팁으로 확인 */}
        <YAxis hide allowDecimals={false} />
        <Tooltip labelFormatter={(iso) => formatKoreanDate(String(iso))} />
        <Legend wrapperStyle={{ paddingTop: 8 }} iconType="plainline" />
        <Line
          type="monotone"
          dataKey="views"
          name="조회수"
          stroke="#0ea5e9"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="visitors"
          name="방문자수"
          stroke="#4f46e5"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrafficChart;
