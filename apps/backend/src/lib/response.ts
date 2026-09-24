import {
	buildPaginationMeta,
	type Paginated,
	type PaginationQuery,
} from "@prettyfull/contracts";

/** Traduit une pagination validée en `limit`/`offset` SQL. */
export const toSqlPagination = (query: Pick<PaginationQuery, "page" | "limit">) => ({
	limit: query.limit,
	offset: (query.page - 1) * query.limit,
});

/** Assemble une réponse paginée à partir des lignes et du total compté. */
export const paginate = <T>(
	data: T[],
	query: Pick<PaginationQuery, "page" | "limit">,
	total: number,
): Paginated<T> => ({
	data,
	meta: buildPaginationMeta(query.page, query.limit, total),
});

/**
 * Sérialise les `Date` en chaînes ISO 8601.
 *
 * Drizzle renvoie des objets `Date` ; `JSON.stringify` les convertirait déjà,
 * mais passer par cet helper garde le typage des réponses honnête vis-à-vis
 * des contrats, qui déclarent des `string`.
 */
export const iso = (value: Date | null | undefined): string | null =>
	value ? value.toISOString() : null;

/** Variante non nullable, pour les colonnes `notNull`. */
export const isoRequired = (value: Date): string => value.toISOString();
