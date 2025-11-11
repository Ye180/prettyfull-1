# Copilot Agent Instructions for PrettyFull Monorepo

These guidelines make an AI agent immediately productive when working in this Turborepo e-commerce monorepo (Next.js + NestJS + shared packages).

## Monorepo Structure & Roles

- `apps/web`: Customer-facing Next.js storefront (port 3000). i18n content pulled from backend. Uses shared UI + store packages.
- `apps/admin`: Back-office Next.js admin (port 3001). Manages catalog & content.
- `apps/backend`: NestJS API (port 7777 dev). Provides product, category, auth, order modules. MongoDB + storage integration.
- `packages/ui`: React component library. Tailwind with `ui:` prefix to avoid style collisions. Use provided variants (see root README) instead of re-implementing.
- `packages/store`: Zustand global state (cart, etc.). Prefer adding slices here for cross-app state.
- `packages/typescript-config` & `packages/eslint-config`: Centralized TS/ESLint configs. New packages/apps should extend these instead of duplicating settings.

## Dev & Build Workflow

- Install: `pnpm install`
- Dev all: `pnpm dev` (turborepo starts each app concurrently).
- Dev single app: `pnpm dev --filter=backend` (or `web`, `admin`).
- Build: `pnpm build` (caches via Turborepo). Build individual with `--filter`.
- Tests (where present): `pnpm test --filter=backend`.
- Lint: `pnpm lint --filter=web` etc. Use shared rules; don’t override per app unless justified.
- Docker: `dockerfiles/*.Dockerfile` used by CI for deploy; keep runtime port mapping consistent with README.

## Backend (NestJS) Conventions

- Modules under `apps/backend/src/modules/*` follow service-oriented design; DTOs + schemas + controller + service colocated.
- Internationalization: Product/category documents store multilingual fields (`name.fr`, `name.en`). Services project a single language view via transformer helpers (e.g. `transformProduct` in `products.service.ts`). When adding new multilingual fields, follow shape `{ fr: string; en: string }` and ensure transformation updates.
- Soft Deletes: Products use `isActive` flag. Removal endpoints flip flag, return formatted response via `formatResponse` util.
- Validation: DTOs rely on `class-validator` + `class-transformer`. For arrays of nested DTOs, always include `@Type(() => ...)` and `@ValidateNested({ each: true })`.
- Variants: In `CreateProductDto` variants is an array of `VariantsProductDto`. Controller methods should accept arrays when bulk adding. Service recalculates `stock` via `calculateTotalStock` after mutation.
- File Uploads: Use `FilesInterceptor('images')` (Multer). Uploaded images passed to `StorageService.uploadMultipleFiles(folder)` which returns objects with `url`. Only store URLs in document arrays (`variant.images`).
- Slugs: Must match regex `^[a-z0-9]+(?:-[a-z0-9]+)*$`. Preserve consistency when generating programmatically.

## Common Patterns to Reuse

- Pagination: Provide `page`, `limit` query params; calculate `skip = (page-1)*limit`; return `{ products, total, page, limit, totalPages }` (see `findAll`). Replicate format for other list endpoints.
- Language header: Controllers read `accept-language` (defaults to `'fr'`). Always pass language into service transformation.
- Stock Handling: Never set `stock` directly when variants change; let helper recompute (see `calculateTotalStock`).
- Soft delete pattern: `findByIdAndUpdate(id, { isActive: false }, { new: true })` then log and wrap response.

## UI / Frontend Conventions

- Tailwind classes with prefix `ui:` inside shared components to avoid global style collisions.
- Consume components via `@prettyfull/ui`; don’t duplicate styling logic.
- Shared state via `@prettyfull/store`; if expanding cart or user state, append new slice rather than introducing ad-hoc React context in apps.

## Adding / Modifying Backend Features

1. Define/extend DTO in `dto/*.dto.ts` with proper validation + translation field structure.
2. Update Mongoose schema (not shown here) to mirror new fields; ensure lean queries populate necessary relations.
3. Extend service: perform validation (ObjectId, slug), project language via transform, recalc derived fields (stock) before save.
4. Update controller: surface endpoint, keep consistent route naming (`kebab-case`), include `@AllowAnonymous` only if public.
5. If returning localized data, accept `@Headers('accept-language')` and pass through.

## Error & Guard Strategy

- Use `BadRequestException` for invalid identifiers/inputs, `NotFoundException` when queries return empty, keep messages in French currently for consistency.
- Role-based access: `@Roles(['admin'])` where admin-only; many endpoints temporarily have `@AllowAnonymous()` for development—remove as hardening.

## Performance / Data Access

- Prefer `.lean()` on read queries to get plain objects for transformation (see product queries).
- Batch operations: Use `Promise.all` when fetching list + count (pagination pattern).

## Migration / Refactors

- When changing price structure, maintain backward compatibility as seen in `update` method (supports old shape fallback). Follow this pattern for future schema evolutions.

## Do / Don’t Quick Reference

- Do recompute `stock` after variant changes using `calculateTotalStock`.
- Do store only image URLs after upload; never raw file buffers in Mongo.
- Do keep multilingual fields grouped under object with `fr` / `en` keys.
- Don’t bypass DTO validation; add new decorators as needed.
- Don’t duplicate configuration; extend shared TS/ESLint configs.

## Example: Adding Product Variants

Controller should accept an array body `{ variants: VariantsProductDto[] }` or singular object; service loops, uploads images, merges into `product.variants`, updates `stock`, saves.

## Open Improvements (Agent Can Help)

- Standardize a response wrapper for pagination across modules.
- Implement stricter i18n header parsing (fallback chain).
- Remove temporary `@AllowAnonymous` on admin-only routes.

Adapt instructions as codebase evolves; keep this file ~under 60 lines and focused on concrete, present patterns.
