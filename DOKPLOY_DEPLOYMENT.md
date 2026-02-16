# 🚀 Guide de Déploiement Dokploy - Medusa Backend

## ✅ Problème Résolu

Le build échouait car Dokploy construisait depuis la racine du monorepo et Turbo essayait de construire TOUS les packages.

**Solution:** Utiliser `Dockerfile.medusa` qui installe uniquement les dépendances de l'app Medusa.

## 📋 Configuration Dokploy

### 1. Build Settings

Dans Dokploy, configurez les paramètres de build :

```
Repository: github.com/by-danmo/prettyfull.git
Branch: main (ou votre branche de production)
Build Context: . (racine du repo)
Dockerfile Path: Dockerfile.medusa
```

### 2. Environment Variables (Runtime)

**⚠️ CRITIQUE:** Configurez ces variables dans Dokploy (JAMAIS dans le Dockerfile)

```bash
# Database (PostgreSQL)
DATABASE_URL=postgresql://medusa:PTSaWIgwwhyLFFk4wc8M@prettyfull-medusadb-dvbjzq:5432/medusa-db?sslmode=require

# Redis
REDIS_URL=redis://default:7bbOrR57ubKPcHyPywtz@prettyfull-medusaredis-6xx16s:6379

# Secrets (GÉNÉREZ DES SECRETS FORTS EN PRODUCTION)
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret

# Backend URL
MEDUSA_BACKEND_URL=https://api.prettyfull.shop

# CORS Configuration
STORE_CORS=http://localhost:8000,https://docs.medusajs.com,dev.prettyfull.shop
ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com,admin.prettyfull.shop,http://localhost:3000
AUTH_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com,admin.prettyfull.shop,http://localhost:3000,https://admin.prettyfull.shop

# Worker Mode
MEDUSA_WORKER_MODE=server

# Admin Dashboard
DISABLE_ADMIN=false

# Environment
NODE_ENV=production
PORT=9000
HOST=0.0.0.0
```

### 3. Réseau et Services

Assurez-vous que dans Dokploy :

- ✅ Le service Medusa et PostgreSQL sont sur le **même réseau Docker**
- ✅ Le hostname `prettyfull-medusadb-dvbjzq` est résolvable
- ✅ Le hostname `prettyfull-medusaredis-6xx16s` est résolvable

### 4. Port Mapping

```
Container Port: 9000
Host Port: 9000 (ou votre port préféré)
```

## 🔧 Déploiement

### Étape 1: Commit et Push

```bash
# Ajouter les fichiers
git add Dockerfile.medusa DOKPLOY_DEPLOYMENT.md apps/prettyfull-medusa/Dockerfile

# Commit
git commit -m "feat: add Dockerfile for Dokploy monorepo deployment"

# Push
git push origin main
```

### Étape 2: Configuration Dokploy

1. **Créer une nouvelle application** (ou modifier l'existante)
2. **Build Settings:**
   - Dockerfile Path: `Dockerfile.medusa`
   - Build Context: `.` (racine)
3. **Environment Variables:** Copier toutes les variables ci-dessus
4. **Network:** Assurer que Medusa, PostgreSQL et Redis sont sur le même réseau
5. **Deploy!**

### Étape 3: Vérification

Après le déploiement, vérifiez :

```bash
# Logs du conteneur
docker logs <container-name>

# Health check
curl https://api.prettyfull.shop/health

# Admin dashboard
https://admin.prettyfull.shop/app
```

## 🐛 Troubleshooting

### Build échoue avec "node_modules missing"

**Cause:** Mauvais Dockerfile utilisé

**Solution:** Utilisez `Dockerfile.medusa` à la racine, pas `apps/prettyfull-medusa/Dockerfile`

### Erreur de connexion PostgreSQL

**Causes possibles:**
1. Hostname incorrect dans `DATABASE_URL`
2. Services pas sur le même réseau Docker
3. SSL mode incorrect

**Solutions:**
```bash
# Vérifier le réseau
docker network inspect <network-name>

# Tester la connexion depuis le conteneur
docker exec -it <medusa-container> psql $DATABASE_URL

# Essayer sans SSL
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=disable

# Ou avec SSL requis
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

### Admin ne charge pas

**Vérifications:**
1. `MEDUSA_BACKEND_URL` est correct
2. `ADMIN_CORS` inclut le domaine admin
3. L'admin a été construit (vérifier les logs de build)
4. Le fichier existe: `docker exec <container> ls -la public/admin/`

### Port déjà utilisé

```bash
# Arrêter tous les conteneurs Medusa
docker stop $(docker ps -q --filter "ancestor=prettyfull-medusa")

# Ou utiliser un port différent
docker run -p 9001:9000 ...
```

## 🔒 Sécurité

### ⚠️ NE JAMAIS:

- ❌ Hardcoder des secrets dans le Dockerfile
- ❌ Commiter des fichiers `.env` avec des secrets réels
- ❌ Exposer les secrets dans les logs
- ❌ Utiliser des secrets faibles (`supersecret`, `password123`, etc.)

### ✅ TOUJOURS:

- ✅ Utiliser les variables d'environnement de Dokploy
- ✅ Générer des secrets forts (32+ caractères aléatoires)
- ✅ Utiliser des placeholders au build-time
- ✅ Passer les vrais secrets au runtime uniquement
- ✅ Activer SSL pour PostgreSQL en production

### Générer des secrets forts:

```bash
# Générer un secret aléatoire
openssl rand -base64 32

# Ou avec Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 📊 Monitoring

### Logs

```bash
# Logs en temps réel
docker logs -f <container-name>

# Dernières 100 lignes
docker logs --tail 100 <container-name>
```

### Health Check

Le conteneur expose un endpoint de santé :

```bash
curl http://localhost:9000/health
```

### Métriques

Dokploy devrait afficher :
- CPU usage
- Memory usage
- Network I/O
- Logs

## 🔄 Mise à jour

Pour déployer une nouvelle version :

1. **Commit et push** vos changements
2. Dans Dokploy, cliquez sur **Redeploy**
3. Dokploy va :
   - Pull le nouveau code
   - Rebuild l'image
   - Arrêter l'ancien conteneur
   - Démarrer le nouveau
   - Exécuter les migrations automatiquement

## 📝 Notes

- Les migrations s'exécutent automatiquement au démarrage (`npx medusa db:migrate`)
- Le conteneur utilise un utilisateur non-root (`medusa:nodejs`) pour la sécurité
- Le health check vérifie `/health` toutes les 30 secondes
- Le build est multi-stage pour optimiser la taille de l'image

## 🆘 Support

Si le déploiement échoue encore :

1. Vérifiez les logs de build dans Dokploy
2. Assurez-vous que `Dockerfile.medusa` est utilisé
3. Vérifiez que toutes les variables d'environnement sont configurées
4. Testez le build localement :
   ```bash
   docker build -f Dockerfile.medusa -t test-medusa .
   docker run -p 9000:9000 --env-file apps/prettyfull-medusa/.env test-medusa
   ```

## ✅ Checklist de Déploiement

- [ ] `Dockerfile.medusa` existe à la racine
- [ ] Dockerfile Path dans Dokploy = `Dockerfile.medusa`
- [ ] Build Context = `.` (racine)
- [ ] Toutes les variables d'environnement configurées
- [ ] PostgreSQL et Redis accessibles
- [ ] Réseau Docker configuré
- [ ] Secrets forts générés
- [ ] CORS configurés pour vos domaines
- [ ] Code committé et pushé
- [ ] Redéployé dans Dokploy
