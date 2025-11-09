#!/bin/bash

# Script de test pour le module Storage avec Garage
# Usage: ./test-storage-upload.sh

echo "🧪 Test du module Storage - Upload vers Garage"
echo "================================================"
echo ""

# Variables
API_URL="http://localhost:3001/api/v1/storage"
TEST_IMAGE="test-image.jpg"
FOLDER="test-uploads"

# Couleurs pour le terminal
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier que curl est installé
if ! command -v curl &> /dev/null; then
    echo -e "${RED}❌ curl n'est pas installé${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "  API URL: $API_URL"
echo "  Test Image: $TEST_IMAGE"
echo "  Folder: $FOLDER"
echo ""

# Test 1: Vérifier que le serveur est accessible
echo -e "${YELLOW}Test 1:${NC} Vérification de l'accès au serveur..."
if curl -s --head "$API_URL/upload" | grep "HTTP/1.1 4" > /dev/null; then
    echo -e "${GREEN}✅ Serveur accessible${NC}"
else
    echo -e "${RED}❌ Serveur non accessible. Assurez-vous que le backend tourne sur le port 3001${NC}"
    exit 1
fi
echo ""

# Créer une image de test si elle n'existe pas
if [ ! -f "$TEST_IMAGE" ]; then
    echo -e "${YELLOW}📸 Création d'une image de test...${NC}"
    # Créer une image 100x100 rouge avec ImageMagick (si disponible)
    if command -v convert &> /dev/null; then
        convert -size 100x100 xc:red "$TEST_IMAGE"
        echo -e "${GREEN}✅ Image de test créée${NC}"
    else
        echo -e "${RED}❌ ImageMagick n'est pas installé. Veuillez créer une image test-image.jpg manuellement${NC}"
        exit 1
    fi
    echo ""
fi

# Test 2: Upload d'une seule image
echo -e "${YELLOW}Test 2:${NC} Upload d'une seule image..."
UPLOAD_RESPONSE=$(curl -s -X POST "$API_URL/upload?folder=$FOLDER" \
    -F "file=@$TEST_IMAGE")

echo "Response:"
echo "$UPLOAD_RESPONSE" | jq '.' 2>/dev/null || echo "$UPLOAD_RESPONSE"

if echo "$UPLOAD_RESPONSE" | grep -q "url"; then
    echo -e "${GREEN}✅ Upload réussi${NC}"
    IMAGE_URL=$(echo "$UPLOAD_RESPONSE" | jq -r '.url')
    IMAGE_KEY=$(echo "$UPLOAD_RESPONSE" | jq -r '.key')
    echo "  URL: $IMAGE_URL"
    echo "  Key: $IMAGE_KEY"
else
    echo -e "${RED}❌ Échec de l'upload${NC}"
fi
echo ""

# Test 3: Vérifier l'accès à l'image uploadée
if [ -n "$IMAGE_URL" ]; then
    echo -e "${YELLOW}Test 3:${NC} Vérification de l'accès à l'image..."
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$IMAGE_URL")
    
    if [ "$HTTP_STATUS" = "200" ]; then
        echo -e "${GREEN}✅ Image accessible (HTTP $HTTP_STATUS)${NC}"
    else
        echo -e "${RED}❌ Image non accessible (HTTP $HTTP_STATUS)${NC}"
    fi
    echo ""
fi

# Test 4: Suppression de l'image
if [ -n "$IMAGE_KEY" ]; then
    echo -e "${YELLOW}Test 4:${NC} Suppression de l'image..."
    DELETE_RESPONSE=$(curl -s -X DELETE "$API_URL/$IMAGE_KEY" -w "\nHTTP_STATUS:%{http_code}")
    HTTP_STATUS=$(echo "$DELETE_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
    
    if [ "$HTTP_STATUS" = "204" ]; then
        echo -e "${GREEN}✅ Image supprimée avec succès${NC}"
    else
        echo -e "${RED}❌ Échec de la suppression (HTTP $HTTP_STATUS)${NC}"
    fi
    echo ""
fi

echo "================================================"
echo -e "${GREEN}✨ Tests terminés!${NC}"
echo ""
echo "Pour tester manuellement:"
echo "  curl -X POST $API_URL/upload?folder=$FOLDER -F \"file=@$TEST_IMAGE\""
