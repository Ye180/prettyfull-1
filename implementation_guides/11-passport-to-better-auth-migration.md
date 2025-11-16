# Migration from Passport/JWT to Better Auth

## Summary

This document describes the complete migration from the legacy Passport/JWT authentication system to Better Auth with `@thallesp/nestjs-better-auth` package.

## Files Deleted

### Complete Auth Module Removal

- `src/modules/auth/` - Entire directory removed
  - `strategies/jwt.strategy.ts`
  - `strategies/local.strategy.ts`
  - `strategies/jwt-refresh.strategy.ts`
  - `guards/jwt-auth.guard.ts`
  - `guards/local-auth.guard.ts`
  - `guards/jwt-refresh.guard.ts`
  - `guards/roles.guard.ts`
  - `decorators/current-user.decorator.ts`
  - `decorators/public.decorator.ts`
  - `decorators/roles.decorator.ts`
  - `dto/login.dto.ts`
  - `dto/register.dto.ts`
  - `auth.controller.ts`
  - `auth.module.ts`
  - `auth.service.ts`

## Controllers Updated

All controllers were updated to use Better Auth decorators instead of Passport/JWT guards:

### 1. Orders Controller (`src/modules/orders/orders.controller.ts`)

**Changes:**

- Removed: `@UseGuards(JwtAuthGuard)` and `@UseGuards(JwtAuthGuard, RolesGuard)`
- Added: `@AllowAnonymous()` for public routes
- Changed: `@Roles(UserRole.ADMIN)` → `@Roles(['admin'])`
- Added: `@Session() session: UserSession` parameter for authenticated routes

**Routes:**

- `POST /orders` - Authenticated (session required)
- `GET /orders` - Public (`@AllowAnonymous()`)
- `GET /orders/user` - Authenticated
- `GET /orders/:id` - Authenticated
- `GET /orders/customer/list` - Public
- `PATCH /orders/:id/status` - Admin only (`@Roles(['admin'])`)
- `PATCH /orders/:id/payment-status` - Admin only
- `POST /orders/:id/cancel` - Authenticated

### 2. Users Controller (`src/modules/users/users.controller.ts`)

**Changes:**

- Removed: Class-level `@UseGuards(JwtAuthGuard, RolesGuard)`
- Removed: `@Public()` decorator (replaced with `@AllowAnonymous()`)
- Changed: `@Roles(UserRole.ADMIN)` → `@Roles(['admin'])`
- Added: Better Auth imports

**Routes:**

- `POST /users` - Public (user registration)
- `GET /users` - Public
- `GET /users/admins` - Admin only
- `GET /users/:id` - Authenticated
- `PATCH /users/:id` - Authenticated
- `DELETE /users/:id` - Admin only

### 3. Products Controller (`src/modules/products/products.controller.ts`)

**Changes:**

- Removed: Commented `@UseGuards(JwtAuthGuard, RolesGuard)` and `@Roles(UserRole.ADMIN)`
- Added: `@AllowAnonymous()` for public product viewing
- Added: `@Roles(['admin'])` for admin operations

**Routes:**

- `GET /products` - Public (list all products)
- `GET /products/:id` - Public (view product)
- `GET /products/slugname/:slug` - Public
- `POST /products` - Admin only
- `PATCH /products/:id` - Admin only
- `DELETE /products/:id` - Admin only

### 4. Categories Controller (`src/modules/categories/categories.controller.ts`)

**Changes:**

- All GET routes marked as `@AllowAnonymous()` (public category browsing)
- Admin routes (POST, PATCH, DELETE) use `@Roles(['admin'])`

**Routes (all public):**

- `GET /categories`
- `GET /categories/primary-category`
- `GET /categories/secondary-category`
- `GET /categories/:id`
- `GET /categories/:id/children`
- `GET /categories/slug/:slug`
- `GET /categories/:id/products`
- `GET /categories/slug/:slug/products`
- `GET /categories/name/:name`
- `GET /categories/slug/:slug/children`

**Admin routes:**

- `POST /categories` - Admin only
- `PATCH /categories/:id` - Admin only
- `DELETE /categories/:id` - Admin only

### 5. Site Content Controller (`src/modules/site-content/site-content.controller.ts`)

**Changes:**

- Removed: `@UseGuards(JwtAuthGuard, RolesGuard)`
- Changed: `@Roles(UserRole.ADMIN)` → `@Roles(['admin'])`

**Routes:**

- `POST /site-content` - Admin only
- `PATCH /site-content/:key` - Admin only

### 6. Address Controller (`src/modules/address/address.controller.ts`)

**Changes:**

- Removed: All `@UseGuards(JwtAuthGuard)` decorators
- All routes now use Better Auth's global guard (authenticated by default)
- Added: `@Session() session: UserSession` to all routes

**Routes (all authenticated):**

- `POST /address` - Create address
- `GET /address` - List all addresses
- `GET /address/:id` - Get address by ID
- `GET /address/:userId` - Get user addresses
- `PATCH /address/:id` - Update address
- `GET /address/:userId/default` - Get default address
- `POST /address/:userId/default/id` - Set default address
- `DELETE /address/:id` - Delete address

## Import Pattern Changes

### Before (Passport/JWT):

```typescript
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Public } from "../auth/decorators/public.decorator";
import { UserRole } from "../users/schemas/user.schema";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("example")
export class ExampleController {
  @Get()
  @Public()
  async findAll() {}

  @Get("admin")
  @Roles(UserRole.ADMIN)
  async adminOnly() {}
}
```

### After (Better Auth):

```typescript
import { AllowAnonymous, Roles, Session } from "@thallesp/nestjs-better-auth";
import type { UserSession } from "@thallesp/nestjs-better-auth";

@Controller("example")
export class ExampleController {
  @Get()
  @AllowAnonymous()
  async findAll() {}

  @Get("admin")
  @Roles(["admin"])
  async adminOnly(@Session() session: UserSession) {}
}
```

## Key Changes Summary

1. **Global Authentication**: Better Auth applies authentication globally by default
   - No need for `@UseGuards(JwtAuthGuard)` on every route
   - Use `@AllowAnonymous()` for public routes

2. **Role Checking**: Changed from enum to string array
   - Before: `@Roles(UserRole.ADMIN)`
   - After: `@Roles(['admin'])`

3. **Session Access**: Use `@Session()` decorator
   - Injects `UserSession` object with user info
   - Type-safe access to user data

4. **No Guards Needed**: Better Auth provides a global guard
   - Automatically protects all routes
   - Simplifies controller code

5. **Type Imports**: Must use `import type` for UserSession
   - Required for TypeScript with `isolatedModules` and `emitDecoratorMetadata`

## Compilation Status

✅ Backend compiles successfully with `pnpm build`
✅ All controllers updated
✅ No remaining references to old auth system (except commented code)
✅ TypeScript errors resolved

## Next Steps

1. Update environment variables for Better Auth
2. Test authentication endpoints:

   ```bash
   # Sign up
   curl -X POST http://localhost:3000/api/auth/sign-up/email \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

   # Sign in
   curl -X POST http://localhost:3000/api/auth/sign-in/email \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}' \
     --cookie-jar cookies.txt

   # Test authenticated endpoint
   curl http://localhost:3000/api/users \
     --cookie cookies.txt
   ```

3. Update frontend to use Better Auth client
4. Test OAuth flows (Google, Facebook)
5. Remove commented code references in `app.module.ts` and `site-content.controller.ts`

## Reference Documentation

- Better Auth Usage: `BETTER_AUTH_USAGE.md`
- Installation Guide: `implementation_guides/10-better-auth-installation-complete.md`
- Official Docs: https://www.better-auth.com/docs/introduction
- NestJS Integration: https://github.com/thallesp/nestjs-better-auth
