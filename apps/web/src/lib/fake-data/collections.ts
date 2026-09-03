import { categories } from "./categories";
import type { FakeCollection } from "./types";

// One collection per shop category (leaf categories only — the synthetic
// "Boutique" nav wrapper isn't a sellable collection).
export const collections: (FakeCollection & { metadata: { categorie_id: string } })[] =
	categories
		.filter((c) => !c.category_children)
		.map((c) => ({
			id: `col_${c.id}`,
			title: c.name,
			handle: c.handle,
			metadata: { categorie_id: c.id },
		}));

export const getCollectionById = (id: string) => collections.find((c) => c.id === id);
