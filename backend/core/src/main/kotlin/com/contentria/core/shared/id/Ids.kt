package com.contentria.core.shared.id

import com.github.f4b6a3.uuid.UuidCreator
import java.util.UUID

/**
 * Identifier generation for every aggregate in [com.contentria.core].
 *
 * Identifiers are assigned when the object is constructed, not by the database on insert,
 * so an aggregate is never in a state where it exists but has no identity. That removes the
 * nullable-id / `!!` pattern the previous model needed.
 *
 * UUIDv7 is time-ordered, which keeps primary key index inserts local instead of scattering
 * them across the B-tree the way UUIDv4 does.
 */
object Ids {

    fun newId(): UUID = UuidCreator.getTimeOrderedEpoch()
}
