package com.contentria.api.auth.infrastructure

import com.contentria.api.auth.domain.RefreshToken
import jakarta.persistence.LockModeType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Lock
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.*

interface RefreshTokenJpaRepository : JpaRepository<RefreshToken, UUID> {

    fun findByToken(token: String): RefreshToken?

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM RefreshToken r WHERE r.token = :token")
    fun findByTokenForUpdate(@Param("token") token: String): RefreshToken?

    fun findByUserId(userId: UUID): RefreshToken?

    fun deleteByToken(token: String): Int
}