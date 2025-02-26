# API Testy pro Trading Dashboard

Tato složka obsahuje nástroje pro testování API volání v aplikaci Trading Dashboard.

## Obsah

- `apiTests.js` - Hlavní soubor s testy pro různá API
- `apiTests.html` - Webové rozhraní pro testování API v prohlížeči
- `runTests.js` - Skript pro spouštění testů z příkazové řádky

## Spuštění testů v příkazové řádce

Pro spuštění testů z příkazové řádky můžeš použít Node.js:

```bash
# Instalace závislostí (pokud ještě nejsou nainstalované)
cd /Users/pazny/Projects/tradindBoard
npm install axios

# Spuštění všech testů
node src/tests/runTests.js all

# Spuštění konkrétního testu
node src/tests/runTests.js coingecko BTC
node src/tests/runTests.js news bitcoin
node src/tests/runTests.js alphavantage MSFT
node src/tests/runTests.js cryptocompare ETH USD

# Zobrazení nápovědy
node src/tests/runTests.js help
```

## Spuštění testů v prohlížeči

Pro spuštění testů v prohlížeči otevři soubor `apiTests.html`:

```bash
# Spuštění lokálního serveru
cd /Users/pazny/Projects/tradindBoard
npx http-server . -o /src/tests/apiTests.html
```

Nebo můžeš soubor otevřít přímo v prohlížeči.

## Dostupné testy

1. **CoinGecko API** - Testování cen kryptoměn
2. **NewsAPI** - Testování zpráv o kryptoměnách a financích
3. **Alpha Vantage API** - Testování dat o akciích
4. **CryptoCompare API** - Testování dat o kryptoměnách

## Poznámky

- Některá API vyžadují API klíče. V testech jsou použity demo klíče nebo veřejné klíče, které mohou mít omezení.
- Pro produkční použití doporučujeme získat vlastní API klíče a nastavit je v konfiguračních souborech.
- Testy jsou navrženy tak, aby fungovaly i bez API klíčů, ale některé funkce mohou být omezené.

## API Klíče

Pro plnou funkčnost testů doporučujeme nastavit následující API klíče:

1. CoinGecko API: https://www.coingecko.com/en/api/pricing
2. Alpha Vantage API: https://www.alphavantage.co/support/#api-key
3. NewsAPI: https://newsapi.org/register
4. CryptoCompare API: https://min-api.cryptocompare.com/pricing

API klíče můžeš nastavit v souboru `.env` v kořenovém adresáři projektu:

```
COINGECKO_API_KEY=tvůj_klíč
ALPHAVANTAGE_API_KEY=tvůj_klíč
NEWSAPI_API_KEY=tvůj_klíč
CRYPTOCOMPARE_API_KEY=tvůj_klíč
```
