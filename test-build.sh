#!/bin/bash

# Barvy pro výstup
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Nastavení proměnné prostředí pro GitHub Pages
export GITHUB_PAGES=true
echo -e "${YELLOW}Nastavuji GITHUB_PAGES=true${NC}"

# Vytvoření build adresáře
echo -e "${GREEN}Vytvářím build adresář...${NC}"
rm -rf build
mkdir -p build

# Vytvoření adresářové struktury
echo -e "${GREEN}Vytvářím adresářovou strukturu...${NC}"
mkdir -p build/node_modules/@tanstack
mkdir -p build/node_modules/axios
mkdir -p build/src

# Kopírování souborů
echo -e "${GREEN}Kopíruji soubory...${NC}"

echo "Kopírování index.html..."
cp index.html build/ || echo -e "${RED}Chyba při kopírování index.html${NC}"

echo "Kopírování src adresáře..."
cp -r src/* build/src/ || echo -e "${RED}Chyba při kopírování src adresáře${NC}"

echo "Kopírování @tanstack knihoven..."
if [ -d "node_modules/@tanstack/react-query" ]; then
  cp -r node_modules/@tanstack/react-query build/node_modules/@tanstack/
elif [ -d "node_modules/@tanstack" ]; then
  cp -r node_modules/@tanstack/* build/node_modules/@tanstack/
else
  echo -e "${YELLOW}Varování: @tanstack knihovny nenalezeny${NC}"
fi

echo "Kopírování axios knihovny..."
if [ -d "node_modules/axios/dist" ]; then
  cp -r node_modules/axios/dist build/node_modules/axios/
elif [ -d "node_modules/axios" ]; then
  cp -r node_modules/axios build/node_modules/
else
  echo -e "${YELLOW}Varování: axios knihovna nenalezena${NC}"
fi

echo "Vytváření .nojekyll souboru..."
touch build/.nojekyll

echo "Struktura build adresáře po kopírování:"
ls -la build/
echo "Struktura build/node_modules:"
ls -la build/node_modules/ || echo "Adresář nenalezen"
echo "Struktura build/node_modules/@tanstack:"
ls -la build/node_modules/@tanstack/ || echo "Adresář nenalezen"

# Vytvoření .env souboru
echo -e "${GREEN}Vytvářím .env soubor...${NC}"
echo "COINGECKO_API_KEY=" > build/.env
echo "ALPHAVANTAGE_API_KEY=demo" >> build/.env
echo "NEWSAPI_API_KEY=8c3fb4fd9bef4a86a2dd1e4ec00b32bf" >> build/.env
echo "CRYPTOCOMPARE_API_KEY=" >> build/.env

echo -e "${GREEN}Build byl úspěšně vytvořen v adresáři build/${NC}"
echo -e "${YELLOW}Pro spuštění lokálního serveru použijte:${NC}"
echo -e "cd build && npx http-server"
