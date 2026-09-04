import { changePasswordSchema, loginSchema, refreshSchema, registerSchema, updateProfileSchema, } from "@prettyfull/contracts";
import { Hono } from "hono";
import { clearRefreshCookie, readRefreshCookie, setRefreshCookie, } from "../../lib/cookies.js";
import { unauthorized } from "../../lib/errors.js";
import { recordAudit } from "../../lib/audit.js";
import { currentUser, requireAuth, requireKind } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import * as service from "./service.js";
/**
 * Routes d'authentification.
 *
 * Deux montages distincts — back-office et storefront — partagent le même
 * service mais pas la même portée de cookie ni le même type de compte
 * attendu. Un jeton du panel n'ouvre donc jamais de session cliente, et
 * réciproquement.
 */
const buildAuthRoutes = (kind, scope) => {
    const app = new Hono();
    const context = (c) => ({
        userAgent: c.get("userAgent"),
        ipAddress: c.get("clientIp"),
    });
    app.post("/login", validate("json", loginSchema), async (c) => {
        const { auth, refreshToken } = await service.login(c.req.valid("json"), kind, context(c));
        setRefreshCookie(c, scope, refreshToken);
        return c.json(auth);
    });
    /**
     * Renouvelle la session. Le jeton arrive normalement par cookie ; le corps
     * de requête sert de repli aux clients non navigateurs (tests, mobile).
     */
    app.post("/refresh", validate("json", refreshSchema), async (c) => {
        const token = readRefreshCookie(c, scope) ?? c.req.valid("json").refreshToken;
        if (!token)
            throw unauthorized("Aucune session à renouveler.");
        const { auth, refreshToken } = await service.refresh(token, kind, context(c));
        setRefreshCookie(c, scope, refreshToken);
        return c.json(auth);
    });
    app.post("/logout", async (c) => {
        await service.logout(readRefreshCookie(c, scope));
        clearRefreshCookie(c, scope);
        return c.json({ success: true });
    });
    app.get("/me", requireAuth, requireKind(kind), async (c) => c.json(await service.getProfile(currentUser(c).sub)));
    app.patch("/me", requireAuth, requireKind(kind), validate("json", updateProfileSchema), async (c) => c.json(await service.updateProfile(currentUser(c).sub, c.req.valid("json"))));
    /**
     * Changement de mot de passe. Toutes les sessions sont révoquées, cookie
     * courant compris : le client doit se reconnecter, y compris ici.
     */
    app.post("/change-password", requireAuth, requireKind(kind), validate("json", changePasswordSchema), async (c) => {
        const { currentPassword, newPassword } = c.req.valid("json");
        const user = currentUser(c);
        await service.changePassword(user.sub, currentPassword, newPassword);
        await recordAudit(c, {
            action: "auth.password_changed",
            resourceType: "user",
            resourceId: user.sub,
        });
        clearRefreshCookie(c, scope);
        return c.json({ success: true });
    });
    return app;
};
export const adminAuthRoutes = buildAuthRoutes("staff", "admin");
export const storeAuthRoutes = (() => {
    const app = buildAuthRoutes("customer", "store");
    // L'inscription libre n'existe que côté storefront : les comptes
    // back-office sont créés depuis le module « Utilisateurs & rôles ».
    app.post("/register", validate("json", registerSchema), async (c) => {
        const { auth, refreshToken } = await service.register(c.req.valid("json"), {
            userAgent: c.get("userAgent"),
            ipAddress: c.get("clientIp"),
        });
        setRefreshCookie(c, "store", refreshToken);
        return c.json(auth, 201);
    });
    return app;
})();
//# sourceMappingURL=routes.js.map