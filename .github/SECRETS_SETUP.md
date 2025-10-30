# 🔐 Configuration des Secrets GitHub Actions

Ce document liste tous les secrets à configurer dans GitHub pour le déploiement automatique.

## 📍 Où configurer les secrets ?

1. Allez sur votre dépôt GitHub : `https://github.com/Danmo-Ar/prettyfull`
2. Cliquez sur **Settings** > **Secrets and variables** > **Actions**
3. Cliquez sur **New repository secret**

---

## 🚀 Secrets de Déploiement

### Secrets Docker Hub

| Secret Name          | Description                  | Exemple                                                              |
| -------------------- | ---------------------------- | -------------------------------------------------------------------- |
| `DOCKERHUB_USERNAME` | Nom d'utilisateur Docker Hub | `danmoar`                                                            |
| `DOCKERHUB_TOKEN`    | Token d'accès Docker Hub     | Généré depuis [Docker Hub](https://hub.docker.com/settings/security) |

### Secrets Serveur SSH

| Secret Name       | Description                      | Exemple                             |
| ----------------- | -------------------------------- | ----------------------------------- |
| `SERVER_HOST`     | Adresse IP ou domaine du serveur | `84.247.187.15`                     |
| `SERVER_USERNAME` | Nom d'utilisateur SSH            | `root` ou `deploy`                  |
| `SSH_PRIVATE_KEY` | Clé privée SSH (contenu complet) | Généré avec `ssh-keygen -t ed25519` |

---

## 🔧 Secrets Backend (Variables d'Environnement)

### Database Configuration

| Secret Name    | Valeur Actuelle                                          | Description              |
| -------------- | -------------------------------------------------------- | ------------------------ |
| `DATABASE_URL` | `mongodb://84.247.187.15:27018/prettyfull-ecommerce-dev` | URL de connexion MongoDB |

### Redis Configuration

| Secret Name      | Valeur Actuelle       | Description                    |
| ---------------- | --------------------- | ------------------------------ |
| `REDIS_HOST`     | `84.247.187.15`       | Adresse du serveur Redis       |
| `REDIS_PORT`     | `6380`                | Port Redis                     |
| `REDIS_PASSWORD` | _(vide ou votre mdp)_ | Mot de passe Redis (optionnel) |

### JWT Configuration

| Secret Name              | Valeur Actuelle                                | Description                        |
| ------------------------ | ---------------------------------------------- | ---------------------------------- |
| `JWT_SECRET`             | `sItGZzGivXGl3TpGF1FEZPJeGXLlbS9ubcs79xzrw8o=` | Secret pour les tokens JWT         |
| `JWT_REFRESH_SECRET`     | `Q7eA9hxCsV3j/TzXXLW8lUy2aJ3j9uIAueQ5LP/aohk=` | Secret pour les refresh tokens     |
| `JWT_EXPIRATION`         | `15m`                                          | Durée de validité du token JWT     |
| `JWT_REFRESH_EXPIRATION` | `7d`                                           | Durée de validité du refresh token |

### Application Configuration

| Secret Name       | Valeur Recommandée       | Description                                          |
| ----------------- | ------------------------ | ---------------------------------------------------- |
| `CORS_ORIGIN`     | `https://prettyfull.com` | Origine autorisée pour CORS (votre domaine frontend) |
| `THROTTLE_TTL`    | `60`                     | Durée de la fenêtre de rate limiting (secondes)      |
| `THROTTLE_LIMIT`  | `100`                    | Nombre max de requêtes par fenêtre                   |
| `XOF_TO_USD_RATE` | `0.0016`                 | Taux de conversion XOF vers USD                      |

---

## 🛠️ Génération des Secrets

### 1. Générer des secrets JWT (si vous voulez en changer)

```bash
# Générer JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Générer JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Générer une paire de clés SSH (si pas déjà fait)

```bash
# Sur votre machine locale
ssh-keygen -t ed25519 -C "deploy@prettyfull"

# Cela crée :
# - ~/.ssh/id_ed25519 (clé privée - à mettre dans SSH_PRIVATE_KEY)
# - ~/.ssh/id_ed25519.pub (clé publique - à ajouter sur le serveur)

# Copier la clé publique sur le serveur
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@84.247.187.15

# Afficher la clé privée (à copier dans GitHub Secret)
cat ~/.ssh/id_ed25519
```

### 3. Créer un token Docker Hub

1. Allez sur [Docker Hub Security](https://hub.docker.com/settings/security)
2. Cliquez sur **New Access Token**
3. Donnez un nom : `GitHub Actions PrettyFull`
4. Permissions : **Read, Write, Delete**
5. Copiez le token généré dans `DOCKERHUB_TOKEN`

---

## ✅ Checklist de Configuration

### Étape 1 : Secrets Docker

- [ ] `DOCKERHUB_USERNAME` configuré
- [ ] `DOCKERHUB_TOKEN` configuré et testé

### Étape 2 : Secrets Serveur

- [ ] `SERVER_HOST` configuré
- [ ] `SERVER_USERNAME` configuré
- [ ] `SSH_PRIVATE_KEY` configuré
- [ ] Clé publique SSH ajoutée sur le serveur (`~/.ssh/authorized_keys`)

### Étape 3 : Secrets Base de Données

- [ ] `DATABASE_URL` configuré avec l'URL MongoDB correcte
- [ ] MongoDB accessible depuis le serveur de déploiement

### Étape 4 : Secrets Redis

- [ ] `REDIS_HOST` configuré
- [ ] `REDIS_PORT` configuré
- [ ] `REDIS_PASSWORD` configuré (ou laissé vide si pas de mot de passe)
- [ ] Redis accessible depuis le serveur de déploiement

### Étape 5 : Secrets JWT

- [ ] `JWT_SECRET` configuré (32+ caractères aléatoires)
- [ ] `JWT_REFRESH_SECRET` configuré (32+ caractères aléatoires)
- [ ] `JWT_EXPIRATION` configuré (`15m` recommandé)
- [ ] `JWT_REFRESH_EXPIRATION` configuré (`7d` recommandé)

### Étape 6 : Secrets Application

- [ ] `CORS_ORIGIN` configuré avec l'URL du frontend
- [ ] `THROTTLE_TTL` configuré (`60` par défaut)
- [ ] `THROTTLE_LIMIT` configuré (`100` par défaut)
- [ ] `XOF_TO_USD_RATE` configuré avec le taux actuel

---

## 🧪 Tester la Configuration

### Test 1 : Connexion SSH

```bash
# Depuis votre machine locale
ssh -i ~/.ssh/id_ed25519 user@84.247.187.15

# Si ça fonctionne, le secret SSH_PRIVATE_KEY est bon
```

### Test 2 : Connexion MongoDB

```bash
# Sur le serveur de déploiement
mongosh "mongodb://84.247.187.15:27018/prettyfull-ecommerce-dev"

# Devrait se connecter sans erreur
```

### Test 3 : Connexion Redis

```bash
# Sur le serveur de déploiement
redis-cli -h 84.247.187.15 -p 6380
# Puis dans Redis CLI :
PING
# Devrait retourner : PONG
```

### Test 4 : Docker Hub

```bash
# Sur le serveur de déploiement
echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
docker pull $DOCKERHUB_USERNAME/prettyfull-backend:latest
```

---

## 🔒 Bonnes Pratiques de Sécurité

1. **Ne jamais commiter les secrets** dans le code source
2. **Utiliser des secrets différents** pour dev/staging/production
3. **Régénérer les secrets JWT** périodiquement (tous les 6 mois)
4. **Limiter les permissions** des tokens Docker Hub
5. **Utiliser une clé SSH dédiée** pour le déploiement
6. **Activer l'authentification** sur MongoDB et Redis en production
7. **Utiliser HTTPS** pour le frontend (Let's Encrypt gratuit)
8. **Configurer un firewall** sur le serveur (UFW)

---

## 🚨 En cas de Compromission

Si un secret est compromis :

1. **Révoquer immédiatement** le secret compromis
2. **Régénérer** un nouveau secret
3. **Mettre à jour** le secret dans GitHub
4. **Redéployer** l'application
5. **Auditer les logs** pour détecter une utilisation malveillante

---

## 📚 Ressources

- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Docker Hub Access Tokens](https://docs.docker.com/docker-hub/access-tokens/)
- [SSH Key Generation](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
- [MongoDB Connection String](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [Redis Security](https://redis.io/docs/management/security/)

---

**✅ Une fois tous les secrets configurés, le déploiement se fera automatiquement à chaque push sur `develop` !**
