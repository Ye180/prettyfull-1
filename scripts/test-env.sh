#!/bin/bash

# Script de test des variables d'environnement pour le déploiement
# Usage: ./scripts/test-env.sh

set -e

echo "🔍 Test de Configuration des Variables d'Environnement"
echo "======================================================"
echo ""

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour vérifier une variable
check_var() {
    local var_name=$1
    local var_value=$2
    local is_secret=$3
    
    if [ -z "$var_value" ]; then
        echo -e "${RED}❌ $var_name est vide${NC}"
        return 1
    else
        if [ "$is_secret" = "true" ]; then
            echo -e "${GREEN}✅ $var_name est défini (valeur masquée)${NC}"
        else
            echo -e "${GREEN}✅ $var_name = $var_value${NC}"
        fi
        return 0
    fi
}

# Charger le fichier .env
if [ -f "apps/backend/.env" ]; then
    export $(cat apps/backend/.env | grep -v '^#' | xargs)
    echo -e "${GREEN}✅ Fichier .env chargé${NC}"
else
    echo -e "${RED}❌ Fichier apps/backend/.env introuvable${NC}"
    exit 1
fi

echo ""
echo "📦 Configuration Base de Données"
echo "--------------------------------"
check_var "DATABASE_URL" "$DATABASE_URL" "true"

echo ""
echo "🔴 Configuration Redis"
echo "---------------------"
check_var "REDIS_HOST" "$REDIS_HOST" "false"
check_var "REDIS_PORT" "$REDIS_PORT" "false"
if [ -n "$REDIS_PASSWORD" ]; then
    check_var "REDIS_PASSWORD" "$REDIS_PASSWORD" "true"
else
    echo -e "${YELLOW}⚠️  REDIS_PASSWORD est vide (OK si Redis sans auth)${NC}"
fi

echo ""
echo "🔐 Configuration JWT"
echo "-------------------"
check_var "JWT_SECRET" "$JWT_SECRET" "true"
check_var "JWT_REFRESH_SECRET" "$JWT_REFRESH_SECRET" "true"
check_var "JWT_EXPIRATION" "$JWT_EXPIRATION" "false"
check_var "JWT_REFRESH_EXPIRATION" "$JWT_REFRESH_EXPIRATION" "false"

echo ""
echo "⚙️  Configuration Application"
echo "----------------------------"
check_var "NODE_ENV" "$NODE_ENV" "false"
check_var "PORT" "$PORT" "false"
check_var "API_PREFIX" "$API_PREFIX" "false"

echo ""
echo "🌐 Configuration CORS & Rate Limiting"
echo "------------------------------------"
check_var "CORS_ORIGIN" "$CORS_ORIGIN" "false"
check_var "THROTTLE_TTL" "$THROTTLE_TTL" "false"
check_var "THROTTLE_LIMIT" "$THROTTLE_LIMIT" "false"

echo ""
echo "💱 Configuration Devise"
echo "----------------------"
check_var "XOF_TO_USD_RATE" "$XOF_TO_USD_RATE" "false"

echo ""
echo "🧪 Test de Connexion"
echo "==================="

# Test MongoDB
echo ""
echo "📦 Test MongoDB..."
if command -v mongosh &> /dev/null; then
    if mongosh "$DATABASE_URL" --eval "db.runCommand({ ping: 1 })" --quiet &> /dev/null; then
        echo -e "${GREEN}✅ Connexion MongoDB réussie${NC}"
    else
        echo -e "${RED}❌ Connexion MongoDB échouée${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  mongosh non installé, test MongoDB ignoré${NC}"
fi

# Test Redis
echo ""
echo "🔴 Test Redis..."
if command -v redis-cli &> /dev/null; then
    if [ -n "$REDIS_PASSWORD" ]; then
        if redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASSWORD" PING &> /dev/null; then
            echo -e "${GREEN}✅ Connexion Redis réussie${NC}"
        else
            echo -e "${RED}❌ Connexion Redis échouée${NC}"
        fi
    else
        if redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" PING &> /dev/null; then
            echo -e "${GREEN}✅ Connexion Redis réussie${NC}"
        else
            echo -e "${RED}❌ Connexion Redis échouée${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠️  redis-cli non installé, test Redis ignoré${NC}"
fi

echo ""
echo "✅ Test terminé !"
echo ""
echo "📋 Prochaines étapes:"
echo "  1. Ajouter ces secrets dans GitHub (Settings > Secrets)"
echo "  2. Vérifier la connectivité depuis le serveur de déploiement"
echo "  3. Pusher sur la branche 'develop' pour déclencher le déploiement"
