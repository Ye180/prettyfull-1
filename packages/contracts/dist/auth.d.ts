import { z } from "zod";
import { USER_KINDS } from "./enums.js";
/**
 * Politique de mot de passe. Volontairement basée sur la longueur plutôt que
 * sur des classes de caractères exotiques : plus efficace et plus utilisable.
 */
export declare const passwordSchema: z.ZodString;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodPipe<z.ZodString, z.ZodEmail>;
    password: z.ZodString;
}, z.core.$strip>;
export type LoginInput = z.infer<typeof loginSchema>;
export declare const registerSchema: z.ZodObject<{
    email: z.ZodPipe<z.ZodString, z.ZodEmail>;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type RegisterInput = z.infer<typeof registerSchema>;
export declare const refreshSchema: z.ZodObject<{
    refreshToken: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const changePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
export declare const requestPasswordResetSchema: z.ZodObject<{
    email: z.ZodPipe<z.ZodString, z.ZodEmail>;
}, z.core.$strip>;
export declare const resetPasswordSchema: z.ZodObject<{
    token: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const addressSchema: z.ZodObject<{
    id: z.ZodUUID;
    firstName: z.ZodString;
    lastName: z.ZodString;
    company: z.ZodNullable<z.ZodString>;
    address1: z.ZodString;
    address2: z.ZodNullable<z.ZodString>;
    city: z.ZodString;
    postalCode: z.ZodNullable<z.ZodString>;
    province: z.ZodNullable<z.ZodString>;
    countryCode: z.ZodString;
    phone: z.ZodNullable<z.ZodString>;
    isDefaultShipping: z.ZodBoolean;
    isDefaultBilling: z.ZodBoolean;
}, z.core.$strip>;
export type Address = z.infer<typeof addressSchema>;
export declare const addressInputSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    company: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    address1: z.ZodString;
    address2: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    city: z.ZodString;
    postalCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    province: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    countryCode: z.ZodString;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isDefaultShipping: z.ZodDefault<z.ZodBoolean>;
    isDefaultBilling: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type AddressInput = z.infer<typeof addressInputSchema>;
export declare const userSchema: z.ZodObject<{
    id: z.ZodUUID;
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phone: z.ZodNullable<z.ZodString>;
    kind: z.ZodEnum<{
        customer: "customer";
        staff: "staff";
    }>;
    status: z.ZodEnum<{
        active: "active";
        inactive: "inactive";
        suspended: "suspended";
    }>;
    roles: z.ZodArray<z.ZodEnum<{
        super_admin: "super_admin";
        catalog_manager: "catalog_manager";
        order_manager: "order_manager";
        support: "support";
    }>>;
    permissions: z.ZodArray<z.ZodString>;
    lastLoginAt: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type User = z.infer<typeof userSchema>;
export declare const authResponseSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodUUID;
        email: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        phone: z.ZodNullable<z.ZodString>;
        kind: z.ZodEnum<{
            customer: "customer";
            staff: "staff";
        }>;
        status: z.ZodEnum<{
            active: "active";
            inactive: "inactive";
            suspended: "suspended";
        }>;
        roles: z.ZodArray<z.ZodEnum<{
            super_admin: "super_admin";
            catalog_manager: "catalog_manager";
            order_manager: "order_manager";
            support: "support";
        }>>;
        permissions: z.ZodArray<z.ZodString>;
        lastLoginAt: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
    }, z.core.$strip>;
    accessToken: z.ZodString;
    expiresIn: z.ZodNumber;
}, z.core.$strip>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
/** Charge utile du JWT. Les permissions y sont inlinées pour éviter un aller-retour base à chaque requête. */
export interface JwtPayload {
    sub: string;
    email: string;
    kind: (typeof USER_KINDS)[number];
    roles: string[];
    permissions: string[];
    exp: number;
    iat: number;
}
export declare const createStaffSchema: z.ZodObject<{
    email: z.ZodPipe<z.ZodString, z.ZodEmail>;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    roles: z.ZodArray<z.ZodEnum<{
        super_admin: "super_admin";
        catalog_manager: "catalog_manager";
        order_manager: "order_manager";
        support: "support";
    }>>;
    status: z.ZodDefault<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
        suspended: "suspended";
    }>>;
}, z.core.$strip>;
export declare const updateStaffSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodEmail>>;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
        suspended: "suspended";
    }>>>;
    roles: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        super_admin: "super_admin";
        catalog_manager: "catalog_manager";
        order_manager: "order_manager";
        support: "support";
    }>>>;
}, z.core.$strip>;
export declare const updateProfileSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const userListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    q: z.ZodOptional<z.ZodString>;
    kind: z.ZodOptional<z.ZodEnum<{
        customer: "customer";
        staff: "staff";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
        suspended: "suspended";
    }>>;
    role: z.ZodOptional<z.ZodEnum<{
        super_admin: "super_admin";
        catalog_manager: "catalog_manager";
        order_manager: "order_manager";
        support: "support";
    }>>;
}, z.core.$strip>;
export declare const auditLogSchema: z.ZodObject<{
    id: z.ZodUUID;
    userId: z.ZodNullable<z.ZodUUID>;
    userName: z.ZodNullable<z.ZodString>;
    action: z.ZodString;
    resourceType: z.ZodString;
    resourceId: z.ZodNullable<z.ZodString>;
    changes: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    ipAddress: z.ZodNullable<z.ZodString>;
    userAgent: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type AuditLog = z.infer<typeof auditLogSchema>;
export declare const auditLogListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    userId: z.ZodOptional<z.ZodUUID>;
    action: z.ZodOptional<z.ZodString>;
    resourceType: z.ZodOptional<z.ZodString>;
    resourceId: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodISODateTime>;
    to: z.ZodOptional<z.ZodISODateTime>;
}, z.core.$strip>;
//# sourceMappingURL=auth.d.ts.map