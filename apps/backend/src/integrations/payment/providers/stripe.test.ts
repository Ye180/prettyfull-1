import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { stripeAdapter } from "./stripe.js";

/** `pnpm test` - vérifie la signature des webhooks et le garde test/live, sans réseau. */

const SECRET = "whsec_test_secret";
const config = {
  environment: "test" as const,
  credentials: { secret_key: "sk_test_x", webhook_secret: SECRET },
  config: {},
};

const event = (type: string, session: Record<string, unknown>) =>
  JSON.stringify({
    id: "evt_1",
    type,
    data: {
      object: { object: "checkout.session", id: "cs_test_1", ...session },
    },
  });

const signed = (
  body: string,
  secret = SECRET,
  at = Math.floor(Date.now() / 1_000),
) => ({
  rawBody: body,
  headers: new Headers({
    "stripe-signature": `t=${at},v1=${createHmac("sha256", secret).update(`${at}.${body}`).digest("hex")}`,
  }),
});

test("session payée : succès rattaché à la commande", async () => {
  const body = event("checkout.session.completed", {
    payment_status: "paid",
    client_reference_id: "order-1",
    amount_total: 15000,
    currency: "xof",
  });
  const verdict = await stripeAdapter.verifyWebhook!(signed(body), config);

  assert.equal(verdict.valid, true);
  assert.equal(verdict.status, "success");
  assert.equal(verdict.orderReference, "order-1");
  assert.equal(verdict.providerTransactionId, "cs_test_1");
  assert.equal(verdict.amount, 15000);
  assert.equal(verdict.externalId, "evt_1");
});

test("paiement différé non encore réglé : en attente", async () => {
  const body = event("checkout.session.completed", {
    payment_status: "unpaid",
  });
  assert.equal(
    (await stripeAdapter.verifyWebhook!(signed(body), config)).status,
    "pending",
  );
});

test("session expirée : annulée", async () => {
  const body = event("checkout.session.expired", {});
  assert.equal(
    (await stripeAdapter.verifyWebhook!(signed(body), config)).status,
    "cancelled",
  );
});

test("mauvais secret, corps altéré ou signature périmée : rejet", async () => {
  const body = event("checkout.session.completed", { payment_status: "paid" });

  assert.equal(
    (await stripeAdapter.verifyWebhook!(signed(body, "whsec_other"), config))
      .valid,
    false,
  );
  assert.equal(
    (
      await stripeAdapter.verifyWebhook!(
        { ...signed(body), rawBody: `${body} ` },
        config,
      )
    ).valid,
    false,
  );
  const old = Math.floor(Date.now() / 1_000) - 3_600;
  assert.equal(
    (await stripeAdapter.verifyWebhook!(signed(body, SECRET, old), config))
      .valid,
    false,
  );
  assert.equal(
    (
      await stripeAdapter.verifyWebhook!(
        { rawBody: body, headers: new Headers() },
        config,
      )
    ).valid,
    false,
  );
});

test("clé de test refusée en production, sans appel réseau", async () => {
  const result = await stripeAdapter.initiate({
    ...config,
    environment: "live",
    order: {
      id: "order-1",
      displayId: 1,
      amount: 15000,
      currency: "xof",
      email: "a@b.c",
      phone: null,
      description: "PF-1",
    },
    successUrl: "https://shop/ok",
    cancelUrl: "https://shop/ko",
    webhookUrl: "https://api/webhooks/stripe",
    expiresAt: new Date(Date.now() + 35 * 60_000),
  });

  assert.equal(result.status, "failed");
  assert.match(result.errorMessage ?? "", /clé Stripe de test/);
});
