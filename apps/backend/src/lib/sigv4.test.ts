import assert from "node:assert/strict";
import { test } from "node:test";
import { presignUrl } from "./sigv4.js";

/**
 * Exemple officiel AWS « Authenticating Requests: Using Query Parameters »
 * (GET test.txt, 24 mai 2013) : la signature attendue est publiée dans leur
 * documentation. Si ce test passe, l'implémentation signe comme AWS - et donc
 * comme R2, qui suit le même algorithme.
 */
test("signature identique à l'exemple officiel AWS", () => {
	const url = presignUrl({
		method: "GET",
		host: "examplebucket.s3.amazonaws.com",
		path: "/test.txt",
		accessKeyId: "AKIAIOSFODNN7EXAMPLE",
		secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
		region: "us-east-1",
		expiresSeconds: 86400,
		now: new Date("2013-05-24T00:00:00Z"),
	});

	assert.match(
		url,
		/X-Amz-Signature=aeeed9bbccd4d02ee5c0109b86d86835f995330da4c265957d157751f604d404$/,
	);
});

test("les en-têtes signés changent la signature (type et poids liés)", () => {
	const base = {
		method: "PUT" as const,
		host: "acct.r2.cloudflarestorage.com",
		path: "/bucket/catalog/2026/11/a.jpg",
		accessKeyId: "id",
		secretAccessKey: "secret",
		expiresSeconds: 300,
		now: new Date("2026-11-09T10:00:00Z"),
	};
	const sig = (headers: Record<string, string>) =>
		presignUrl({ ...base, headers }).split("X-Amz-Signature=")[1];

	const jpeg = sig({ "Content-Type": "image/jpeg", "Content-Length": "100" });
	assert.notEqual(jpeg, sig({ "Content-Type": "image/png", "Content-Length": "100" }));
	assert.notEqual(jpeg, sig({ "Content-Type": "image/jpeg", "Content-Length": "101" }));
	assert.equal(jpeg, sig({ "content-length": "100", "content-type": "image/jpeg" }));
});
