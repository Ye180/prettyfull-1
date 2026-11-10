#!/usr/bin/env bash
# Génère les icônes de la PWA à partir d'un pictogramme.
#
#   ./scripts/pwa-icons.sh                 # depuis src/app/icon.svg
#   ./scripts/pwa-icons.sh mon-logo.svg    # ou .png carré (1024×1024 conseillé)
#
# Prérequis : rsvg-convert (librsvg) et magick (ImageMagick 7).
# Un SVG est recoloré en blanc (traits #111827) ; un PNG est utilisé tel quel.
set -euo pipefail

cd "$(dirname "$0")/.."

SOURCE="${1:-src/app/icon.svg}"
BACKGROUND="#141311" # --color-brand
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Pictogramme seul, haute définition, fond transparent.
if [[ "$SOURCE" == *.svg ]]; then
	sed 's/#111827/#ffffff/g' "$SOURCE" > "$TMP/mark.svg"
	rsvg-convert -w 1024 -h 1024 "$TMP/mark.svg" -o "$TMP/mark.png"
else
	magick "$SOURCE" -resize 1024x1024 "$TMP/mark.png"
fi

# icon <taille> <part du pictogramme en %> <sortie>
icon() {
	local size=$1 ratio=$2 out=$3
	local mark=$((size * ratio / 100))
	magick -size "${size}x${size}" "xc:$BACKGROUND" \
		\( "$TMP/mark.png" -resize "${mark}x${mark}" \) \
		-gravity center -composite -alpha off -depth 8 -strip "$out"
}

mkdir -p public/icons
icon 192 60 public/icons/icon-192.png
icon 512 60 public/icons/icon-512.png
# Maskable : Android peut rogner jusqu'à un cercle de 80 % du diamètre ;
# un carré de 50 % y tient entièrement (diagonale ≈ 71 %).
icon 512 50 public/icons/icon-maskable-512.png
# iOS : pas de transparence, coins arrondis appliqués par le système.
icon 180 60 src/app/apple-icon.png

echo "Icônes générées depuis $SOURCE"
