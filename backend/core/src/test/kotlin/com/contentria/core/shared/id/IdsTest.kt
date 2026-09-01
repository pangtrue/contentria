package com.contentria.core.shared.id

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import java.util.UUID

class IdsTest {

    @Test
    @DisplayName("UUID 버전 7을 발급한다")
    fun `issues version 7 identifiers`() {
        assertThat(Ids.newId().version()).isEqualTo(7)
    }

    @Test
    @DisplayName("연속 발급한 식별자는 서로 다르다")
    fun `successive identifiers are distinct`() {
        val ids = List(10_000) { Ids.newId() }

        assertThat(ids.toSet()).hasSize(ids.size)
    }

    @Test
    @DisplayName("시간 순으로 증가한다. 기본키 인덱스 삽입 위치가 흩어지지 않는 근거다")
    fun `identifiers are time-ordered`() {
        val timestamps = List(1_000) { millisOf(Ids.newId()) }

        assertThat(timestamps).isSorted()
    }

    /** UUIDv7 lays the 48-bit Unix millisecond timestamp in the high bits of the high half. */
    private fun millisOf(id: UUID): Long = id.mostSignificantBits ushr 16
}
