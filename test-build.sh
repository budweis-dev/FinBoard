#!/bin/bash

# Skript pro testování buildu a lokální spuštění

# Barvy pro výstup
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Testování buildu pro GitHub Pages ===${NC}"

# Vytvoření build adresáře
echo -e "${GREEN}Vytvářím build adresář...${NC}"
rm -rf build
mkdir -p build

# Kopírování souborů
echo -e "${GREEN}Kopíruji soubory...${NC}"
cp -r public/* build/
cp index.html build/
cp -r src build/
mkdir -p build/node_modules/@tanstack
cp -r node_modules/@tanstack/react-query build/node_modules/@tanstack/
mkdir -p build/node_modules/axios
cp -r node_modules/axios/dist build/node_modules/axios/
touch build/.nojekyll

# Vytvoření .env souboru
echo -e "${GREEN}Vytvářím .env soubor...${NC}"
if [ -f .env ]; then
  cp .env build/
else
  echo "COINGECKO_API_KEY=" > build/.env
  echo "ALPHAVANTAGE_API_KEY=demo" >> build/.env
  echo "NEWSAPI_API_KEY=8c3fb4fd9bef4a86a2dd1e4ec00b32bf" >> build/.env
  echo "CRYPTOCOMPARE_API_KEY=" >> build/.env
  echo -e "${YELLOW}Varování: .env soubor neexistuje, vytvořen defaultní${NC}"
fi

echo -e "${GREEN}Build dokončen!${NC}"

# Spuštění lokálního serveru
echo -e "${YELLOW}Spouštím lokální server...${NC}"
echo -e "${YELLOW}Aplikace bude dostupná na http://localhost:8080${NC}"
echo -e "${YELLOW}Pro ukončení stiskni Ctrl+C${NC}"
npx http-server build -o
