import assert from "node:assert/strict";
import { test } from "node:test";
import { AppError } from "../lib/errors.js";
import { consumeRateLimit, resetRateLimits } from "./rate-limit.js";

/** `pnpm test` - fenêtre fixe : `limit` passages, puis 429 avec Retry-After. */

test("bloque au-delà de la limite, par clé", () => {
	resetRateLimits();
	for (let attempt = 0; attempt < 3; attempt += 1) consumeRateLimit("login", "1.2.3.4", 3, 60_000);

	assert.throws(
		() => consumeRateLimit("login", "1.2.3.4", 3, 60_000),
		(error: unknown) =>
			error instanceof AppError && error.status === 429 && (error.retryAfter ?? 0) > 0,
	);
	// Une autre IP, ou un autre compteur, n'est pas affecté.
	assert.doesNotThrow(() => consumeRateLimit("login", "5.6.7.8", 3, 60_000));
	assert.doesNotThrow(() => consumeRateLimit("register", "1.2.3.4", 3, 60_000));
});

test("la fenêtre se réinitialise une fois écoulée", async () => {
	resetRateLimits();
	consumeRateLimit("pay", "ip", 1, 20);
	assert.throws(() => consumeRateLimit("pay", "ip", 1, 20));
	await new Promise((resolve) => setTimeout(resolve, 30));
	assert.doesNotThrow(() => consumeRateLimit("pay", "ip", 1, 20));
});
