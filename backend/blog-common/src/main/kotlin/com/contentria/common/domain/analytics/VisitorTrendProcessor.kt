package com.contentria.common.domain.analytics

import org.springframework.stereotype.Component
import java.time.LocalDate

/** A single day's traffic metrics on the trend series. */
data class DailyTrendPoint(
    val visitors: Long,
    val views: Long
)

@Component
class VisitorTrendProcessor {

    fun generateTrendSeries(
        startDate: LocalDate,
        endDate: LocalDate,
        historyStatsMap: Map<LocalDate, DailyStatistics>,
        todayVisitors: Long,
        todayViews: Long
    ): Map<LocalDate, DailyTrendPoint> {
        val result = mutableMapOf<LocalDate, DailyTrendPoint>()
        val today = LocalDate.now()

        var currentDate = startDate
        while (!currentDate.isAfter(endDate)) {
            val point = if (currentDate.isEqual(today)) {
                // Today's stats are not aggregated into daily_statistics yet; use live counts.
                DailyTrendPoint(visitors = todayVisitors, views = todayViews)
            } else {
                val stats = historyStatsMap[currentDate]
                DailyTrendPoint(visitors = stats?.visitCount ?: 0L, views = stats?.viewCount ?: 0L)
            }

            result[currentDate] = point
            currentDate = currentDate.plusDays(1)
        }

        return result
    }
}
