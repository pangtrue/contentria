package com.contentria.core.shared.persistence

import jakarta.persistence.Column
import jakarta.persistence.MappedSuperclass
import jakarta.persistence.PrePersist
import jakarta.persistence.PreUpdate
import java.time.Instant

/**
 * Audit columns shared by every persisted aggregate.
 *
 * Timestamps are maintained by JPA lifecycle callbacks rather than Spring Data's
 * `@CreatedDate` / `@LastModifiedDate`. Domain classes are allowed to reference
 * `jakarta.persistence` but nothing from `org.springframework`, and this way the audit
 * behaviour needs no `@EnableJpaAuditing` wiring in the application modules.
 */
@MappedSuperclass
abstract class BaseEntity {

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant = Instant.now()
        protected set

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now()
        protected set

    @PrePersist
    protected fun onPersist() {
        val now = Instant.now()
        createdAt = now
        updatedAt = now
    }

    @PreUpdate
    protected fun onUpdate() {
        updatedAt = Instant.now()
    }
}
