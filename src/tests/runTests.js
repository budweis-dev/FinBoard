#!/usr/bin/env node

// Skript pro spuštění API testů z příkazové řádky
const { runAllTests, runSingleTest } = require('./apiTests');

// Zpracování argumentů příkazové řádky
const args = process.argv.slice(2);

// Zobrazení nápovědy
const showHelp = () => {
    console.log(`
API Testy - Trading Dashboard
-----------------------------
Použití:
  node runTests.js [test] [parametry...]

Dostupné testy:
  all             - Spustí všechny testy
  coingecko       - Test CoinGecko API [symbol=BTC]
  news            - Test NewsAPI [searchTerm=cryptocurrency]
  alphavantage    - Test Alpha Vantage API [symbol=MSFT]
  cryptocompare   - Test CryptoCompare API [fromSymbol=BTC] [toSymbol=USD]
  help            - Zobrazí tuto nápovědu

Příklady:
  node runTests.js all
  node runTests.js coingecko ETH
  node runTests.js news bitcoin
  node runTests.js cryptocompare ETH EUR
    `);
};

// Hlavní funkce
const main = async () => {
    // Pokud nejsou žádné argumenty, zobrazíme nápovědu
    if (args.length === 0) {
        showHelp();
        return;
    }

    const testName = args[0].toLowerCase();
    const testArgs = args.slice(1);

    // Zpracování příkazů
    switch (testName) {
        case 'all':
            await runAllTests();
            break;
        case 'help':
            showHelp();
            break;
        case 'coingecko':
        case 'news':
        case 'alphavantage':
        case 'cryptocompare':
            await runSingleTest(testName, ...testArgs);
            break;
        default:
            console.error(`Neznámý test: ${testName}`);
            showHelp();
    }
};

// Spuštění hlavní funkce
main().catch(error => {
    console.error('Chyba při spuštění testů:', error);
    process.exit(1);
});
