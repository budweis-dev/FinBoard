// API configuration
const apiConfig = {
    // Global setting to control if we use real or dummy data
    useRealData: true,
    
    // CoinGecko API - Free tier doesn't require API key
    coinGecko: {
        baseUrl: 'https://api.coingecko.com/api/v3',
        apiKey: getEnv('COINGECKO_API_KEY', ''),
        hasKey: false, // Set to true if you have a Pro API key
    },
    
    // Alpha Vantage API
    alphaVantage: {
        baseUrl: 'https://www.alphavantage.co/query',
        apiKey: getEnv('ALPHAVANTAGE_API_KEY', 'demo'),
    },
    
    // NewsAPI
    newsAPI: {
        baseUrl: 'https://newsapi.org/v2',
        apiKey: getEnv('NEWSAPI_API_KEY', '8c3fb4fd9bef4a86a2dd1e4ec00b32bf'),
    },
    
    // Crypto Compare API - Free tier with a limited number of calls
    cryptoCompare: {
        baseUrl: 'https://min-api.cryptocompare.com/data',
        apiKey: getEnv('CRYPTOCOMPARE_API_KEY', ''),
    },
    
    // Mappings for standard symbols to API-specific symbols
    symbolMappings: {
        // CoinGecko uses different IDs
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'LTC': 'litecoin',
        'XRP': 'ripple',
        'ADA': 'cardano',
        'DOT': 'polkadot',
        'DOGE': 'dogecoin',
        'SOL': 'solana',
        'LINK': 'chainlink',
        'MATIC': 'matic-network',
        'AVAX': 'avalanche-2',
        'UNI': 'uniswap',
    },
    
    // Convert exchange names to API-friendly formats
    exchangeMappings: {
        'Binance': 'binance',
        'Coinbase': 'gdax',
        'Kraken': 'kraken',
        'Bitstamp': 'bitstamp',
        'FTX': 'ftx',
        'Huobi': 'huobi',
        'KuCoin': 'kucoin',
    },
    
    // Toggle between real and dummy data
    toggleDataSource: function() {
        this.useRealData = !this.useRealData;
        return this.useRealData;
    }
};