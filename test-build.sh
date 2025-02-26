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
mkdir -p build/src/components/layout
mkdir -p build/src/components/modules
mkdir -p build/src/services
mkdir -p build/src/utils
mkdir -p build/src/styles
mkdir -p build/src/tests

# Kopírování souborů
echo -e "${GREEN}Kopíruji soubory...${NC}"

echo "Kopírování index.html..."
cp index.html build/ || echo -e "${RED}Chyba při kopírování index.html${NC}"

echo "Kopírování src adresáře..."
cp -r src/components/layout/* build/src/components/layout/ || echo -e "${RED}Chyba při kopírování layout components adresáře${NC}"
cp -r src/components/modules/* build/src/components/modules/ || echo -e "${RED}Chyba při kopírování modules components adresáře${NC}"
cp -r src/services/* build/src/services/ || echo -e "${RED}Chyba při kopírování services adresáře${NC}"
cp -r src/utils/* build/src/utils/ || echo -e "${RED}Chyba při kopírování utils adresáře${NC}"
cp -r src/styles/* build/src/styles/ || echo -e "${RED}Chyba při kopírování styles adresáře${NC}"
cp -r src/tests/* build/src/tests/ || echo -e "${RED}Chyba při kopírování tests adresáře${NC}"
cp -r src/App.js build/src/ || echo -e "${RED}Chyba při kopírování App.js${NC}"
cp -r src/index.js build/src/ || echo -e "${RED}Chyba při kopírování index.js${NC}"
cp -r src/loader.js build/src/ || echo -e "${RED}Chyba při kopírování loader.js${NC}"

# Ensure App.js has the React hooks defined and global export
sed -i '' '1s/^/\/\/ Hlavní aplikace\n\/\/ Explicitně definujeme React hooks\nconst { useState, useEffect, useRef } = React;\n\n/' build/src/App.js
echo -e "\n// Globální export pro přístup v HTML\nwindow.App = App;" >> build/src/App.js

# Fix loader.js to avoid duplicate variable declarations
sed -i '' 's/const isGitHubPages = window.location.hostname.includes/if (typeof window.isGitHubPages === "undefined") {\n    window.isGitHubPages = window.location.hostname.includes/g' build/src/loader.js
sed -i '' 's/window.basePath = isGitHubPages/if (typeof window.basePath === "undefined") {\n    window.basePath = window.isGitHubPages/g' build/src/loader.js
sed -i '' 's/window.getPath = (path) => {/if (typeof window.getPath === "undefined") {\n    window.getPath = (path) => {/g' build/src/loader.js

# Fix React Query initialization in index.html
sed -i '' 's/if (typeof tanstack !== "undefined" && typeof tanstack.createQueryClient !== "undefined") {/if (typeof window.tanstack !== "undefined") {\n                    console.log("Using tanstack namespace for React Query");\n                    if (typeof window.tanstack.QueryClient !== "undefined") {/g' build/index.html
sed -i '' 's/window.queryClient = new tanstack.createQueryClient({/window.queryClient = new window.tanstack.QueryClient({/g' build/index.html
sed -i '' 's/window.QueryClientProvider = tanstack.QueryClientProvider;/window.QueryClientProvider = window.tanstack.QueryClientProvider;/g' build/index.html

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
