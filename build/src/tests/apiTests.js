// API Tests for Trading Dashboard
// Tento soubor obsahuje testy pro API volání

// Importy
const axios = require('axios');

// Načtení konfigurace API z našeho projektu
const apiConfig = {
    // CoinGecko API
    coinGecko: {
        baseUrl: 'https://api.coingecko.com/api/v3',
        apiKey: process.env.COINGECKO_API_KEY || '',
    },
    
    // Alpha Vantage API
    alphaVantage: {
        baseUrl: 'https://www.alphavantage.co/query',
        apiKey: process.env.ALPHAVANTAGE_API_KEY || 'demo',
    },
    
    // NewsAPI
    newsAPI: {
        baseUrl: 'https://newsapi.org/v2',
        apiKey: process.env.NEWSAPI_API_KEY || '8c3fb4fd9bef4a86a2dd1e4ec00b32bf',
    },
    
    // Crypto Compare API
    cryptoCompare: {
        baseUrl: 'https://min-api.cryptocompare.com/data',
        apiKey: process.env.CRYPTOCOMPARE_API_KEY || '',
    },
    
    // Mappings pro symboly
    symbolMappings: {
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'LTC': 'litecoin',
        'XRP': 'ripple',
        'ADA': 'cardano',
        'DOT': 'polkadot',
        'DOGE': 'dogecoin',
    },
};

// Helper funkce
const getCoinGeckoId = (symbol) => {
    if (!symbol) return null;
    return apiConfig.symbolMappings[symbol] || symbol.toLowerCase();
};

// Testy pro CoinGecko API
const testCoinGeckoPrice = async (symbol = 'BTC') => {
    try {
        console.log(`Testování CoinGecko API pro symbol: ${symbol}`);
        
        const coinId = getCoinGeckoId(symbol);
        if (!coinId) throw new Error('Neznámý symbol');
        
        const apiUrl = `${apiConfig.coinGecko.baseUrl}/simple/price`;
        const params = {
            ids: coinId,
            vs_currencies: 'usd',
            include_24hr_change: true,
        };
        
        // Přidání API klíče, pokud je dostupný
        if (apiConfig.coinGecko.apiKey) {
            params.x_cg_pro_api_key = apiConfig.coinGecko.apiKey;
        }
        
        console.log(`Volání API: ${apiUrl}`);
        const response = await axios.get(apiUrl, { params });
        
        console.log('Odpověď API:');
        console.log(JSON.stringify(response.data, null, 2));
        
        return response.data;
    } catch (error) {
        console.error('Chyba při testování CoinGecko API:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        return null;
    }
};

// Test pro NewsAPI
const testNewsAPI = async (searchTerm = 'cryptocurrency') => {
    try {
        console.log(`Testování NewsAPI pro téma: ${searchTerm}`);
        
        const apiUrl = `${apiConfig.newsAPI.baseUrl}/everything`;
        const params = {
            q: searchTerm,
            apiKey: apiConfig.newsAPI.apiKey,
            language: 'en',
            pageSize: 5,
            sortBy: 'publishedAt',
        };
        
        console.log(`Volání API: ${apiUrl}`);
        const response = await axios.get(apiUrl, { params });
        
        console.log('Odpověď API (prvních 5 článků):');
        const articles = response.data.articles || [];
        
        articles.slice(0, 5).forEach((article, idx) => {
            console.log(`\nČlánek ${idx + 1}:`);
            console.log(`Titulek: ${article.title}`);
            console.log(`Datum: ${new Date(article.publishedAt).toLocaleString()}`);
            console.log(`URL: ${article.url}`);
        });
        
        return articles;
    } catch (error) {
        console.error('Chyba při testování NewsAPI:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        return null;
    }
};

// Test pro Alpha Vantage API
const testAlphaVantageAPI = async (symbol = 'MSFT') => {
    try {
        console.log(`Testování Alpha Vantage API pro symbol: ${symbol}`);
        
        const apiUrl = apiConfig.alphaVantage.baseUrl;
        const params = {
            function: 'GLOBAL_QUOTE',
            symbol: symbol,
            apikey: apiConfig.alphaVantage.apiKey,
        };
        
        console.log(`Volání API: ${apiUrl}`);
        const response = await axios.get(apiUrl, { params });
        
        console.log('Odpověď API:');
        console.log(JSON.stringify(response.data, null, 2));
        
        return response.data;
    } catch (error) {
        console.error('Chyba při testování Alpha Vantage API:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        return null;
    }
};

// Test pro CryptoCompare API
const testCryptoCompareAPI = async (fsym = 'BTC', tsym = 'USD') => {
    try {
        console.log(`Testování CryptoCompare API pro pár: ${fsym}/${tsym}`);
        
        const apiUrl = `${apiConfig.cryptoCompare.baseUrl}/price`;
        const params = {
            fsym: fsym,
            tsyms: tsym,
        };
        
        // Přidání API klíče, pokud je dostupný
        if (apiConfig.cryptoCompare.apiKey) {
            params.api_key = apiConfig.cryptoCompare.apiKey;
        }
        
        console.log(`Volání API: ${apiUrl}`);
        const response = await axios.get(apiUrl, { params });
        
        console.log('Odpověď API:');
        console.log(JSON.stringify(response.data, null, 2));
        
        return response.data;
    } catch (error) {
        console.error('Chyba při testování CryptoCompare API:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        return null;
    }
};

// Funkce pro spuštění všech testů
const runAllTests = async () => {
    console.log('=== SPOUŠTÍM VŠECHNY API TESTY ===');
    
    console.log('\n=== TEST 1: CoinGecko API ===');
    await testCoinGeckoPrice('BTC');
    
    console.log('\n=== TEST 2: NewsAPI ===');
    await testNewsAPI('bitcoin');
    
    console.log('\n=== TEST 3: Alpha Vantage API ===');
    await testAlphaVantageAPI('MSFT');
    
    console.log('\n=== TEST 4: CryptoCompare API ===');
    await testCryptoCompareAPI('BTC', 'USD');
    
    console.log('\n=== TESTY DOKONČENY ===');
};

// Spuštění jednotlivého testu
const runSingleTest = async (testName, ...args) => {
    switch (testName.toLowerCase()) {
        case 'coingecko':
            await testCoinGeckoPrice(args[0] || 'BTC');
            break;
        case 'news':
            await testNewsAPI(args[0] || 'cryptocurrency');
            break;
        case 'alphavantage':
            await testAlphaVantageAPI(args[0] || 'MSFT');
            break;
        case 'cryptocompare':
            await testCryptoCompareAPI(args[0] || 'BTC', args[1] || 'USD');
            break;
        default:
            console.error(`Neznámý test: ${testName}`);
            console.log('Dostupné testy: coingecko, news, alphavantage, cryptocompare');
    }
};

// Export funkcí pro použití v Node.js
module.exports = {
    testCoinGeckoPrice,
    testNewsAPI,
    testAlphaVantageAPI,
    testCryptoCompareAPI,
    runAllTests,
    runSingleTest,
};

// Pokud je soubor spuštěn přímo (node apiTests.js), spustí všechny testy
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        runAllTests();
    } else {
        const [testName, ...testArgs] = args;
        runSingleTest(testName, ...testArgs);
    }
}
