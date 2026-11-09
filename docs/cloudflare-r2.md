# Stockage des visuels avec Cloudflare R2

Remplace UploadThing pour tout le projet (API, storefront, back-office). R2 est compatible S3, sans frais de sortie de données.

## Fonctionnement

```
Navigateur                      API (Hono)                     Cloudflare R2
    │ 1. POST /uploads/presign      │                                │
    │    {type, taille}  ─────────► │ jeton, permission, type, poids │
    │ ◄───── URL signée (5 min) ─── │ signature SigV4, sans SDK      │
    │ 2. PUT du fichier directement ───────────────────────────────► │
    │ 3. adresse publique du fichier = R2_PUBLIC_URL/<clé>           │
```

Le fichier ne passe jamais par l'API. L'URL signée est liée au **type** et au **poids** annoncés : R2 refuse toute requête dont l'en-tête diffère.

| Destination    | Qui                                     | Limite            |
| -------------- | --------------------------------------- | ----------------- |
| `catalogImage` | back-office, permission `catalog.write` | 10 fichiers, 8 Mo |
| `contentImage` | back-office, permission `content.write` | 10 fichiers, 8 Mo |
| `reviewPhoto`  | public (storefront), 10 envois/h par IP | 4 fichiers, 4 Mo  |

Formats : JPEG, PNG, WebP, AVIF, GIF. **Pas de SVG** (il peut contenir du script). Clés : `catalog/2026/11/<uuid>.jpg`, jamais le nom d'origine. Cache : un an, `immutable` (la clé ne change jamais).

## Mise en place (une fois)

### 1. Lecture publique du bucket

Bucket → Settings → **Custom Domains → Add** (recommandé en production, ex. `cdn.prettyfull.shop`, avec cache Cloudflare). Pour tester en local : **Public Development URL → Enable** (adresse `https://pub-xxxx.r2.dev`, limitée en débit, à ne pas utiliser en production).

### 2. CORS du bucket (obligatoire)

Settings → **CORS Policy → Add** :

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://www.prettyfull.shop",
      "https://admin.prettyfull.shop"
    ],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 86400
  }
]
```

Sans cela, le navigateur bloque l'envoi (erreur « n'a pas pu être envoyé »). En production, ne laissez que vos vrais domaines.

### 3. Clés d'API S3

R2 → **Manage API tokens → Create API token**, permission **Object Read & Write**, limitée à ce bucket. Notez l'_Access Key ID_ et la _Secret Access Key_ (affichée une seule fois).

### 4. Variables

`apps/backend/.env` :

```dotenv
R2_ACCOUNT_ID=cf18154cffdcad67a33278dcbe78885a
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=version1
R2_PUBLIC_URL=[https://pub-xxxx.r2.dev      # ou https://cdn.prettyfull.shop](https://pub-8300ca77d54742a0abe91593edcdb75e.r2.dev)
```

`apps/web/.env` et `apps/admin/.env` (même adresse publique, lue à la compilation par `next/image`) :

```dotenv
NEXT_PUBLIC_MEDIA_URL=https://pub-xxxx.r2.dev
```

Redémarrer ensuite l'API, puis reconstruire le site et le panel.

## Vérifier

Panel → un produit → glisser une image : elle apparaît dans le bucket sous `catalog/…`. Sans configuration, le panel masque le glisser-déposer et garde le champ d'URL.

## Visuels existants

Les images déjà téléversées sur UploadThing (`*.ufs.sh`) continuent de s'afficher : leurs hôtes restent autorisés. Pour les migrer, retéléversez-les depuis le panel ; elles ne sont pas copiées automatiquement.

## Sécurité

- Clés R2 uniquement côté API, jamais dans le navigateur. Jetons limités à un bucket.
- Une URL signée dure 5 min et ne sert qu'à un fichier, d'un type et d'un poids donnés.
- Les avis n'acceptent que des photos hébergées dans notre bucket.
- La suppression (`DELETE /api/admin/uploads?key=…`) n'accepte que les clés au format ci-dessus.

## Réutiliser dans un autre projet

Copier `apps/backend/src/lib/sigv4.ts` (signature, sans dépendance, testée contre l'exemple officiel AWS dans `sigv4.test.ts`) et `r2.ts` (clés, URL signées), puis `packages/utils/lib/upload.ts` côté navigateur. Fonctionne avec tout stockage compatible S3 : changer l'hôte dans `signFor`.
