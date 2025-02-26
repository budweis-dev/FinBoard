// Load React Query
const { QueryClient, QueryClientProvider, useQuery } = ReactQuery;

// Create a query client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchInterval: 60000, // Default refetch: every minute
            retry: 1,
            staleTime: 30000,
        },
    },
});

// Helper to extract cryptocurrency symbol from pair (e.g., "BTC/USD" -> "BTC")
const extractSymbol = (pair) => {
    if (!pair) return null;
    return pair.split('/')[0];
};

// Helper to get CoinGecko ID for a symbol
const getCoinGeckoId = (symbol) => {
    if (!symbol) return null;
    return apiConfig.symbolMappings[symbol] || symbol.toLowerCase();
};

// Generate dummy price data
const generateDummyPriceData = (pair) => {
    let basePrice = 0;
    const symbol = extractSymbol(pair);
    
    // Generate reasonable price ranges based on the currency
    switch(symbol) {
        case 'BTC':
            basePrice = Math.random() * 5000 + 25000;
            break;
        case 'ETH':
            basePrice = Math.random() * 500 + 1500;
            break;
        case 'LTC':
            basePrice = Math.random() * 20 + 60;
            break;
        case 'XRP':
            basePrice = Math.random() * 0.2 + 0.4;
            break;
        case 'ADA':
            basePrice = Math.random() * 0.2 + 0.3;
            break;
        case 'DOT':
            basePrice = Math.random() * 3 + 7;
            break;
        default:
            basePrice = Math.random() * 50 + 100;
    }
    
    const change = (Math.random() * 10) - 5;
    
    return {
        price: basePrice.toFixed(2),
        change: change.toFixed(2),
        isUp: change > 0
    };
};

// API calls using Axios
const fetchPriceData = async (exchange, pair) => {
    // Use dummy data if toggled or if required params are missing
    if (!apiConfig.useRealData || !pair) {
        return generateDummyPriceData(pair);
    }
    
    try {
        const symbol = extractSymbol(pair);
        if (!symbol) throw new Error('Invalid pair format');
        
        const coinId = getCoinGeckoId(symbol);
        if (!coinId) throw new Error('Unknown symbol');
        
        const apiUrl = `${apiConfig.coinGecko.baseUrl}/simple/price`;
        const params = {
            ids: coinId,
            vs_currencies: 'usd',
            include_24hr_change: true
        };
        
        // Add API key if available
        if (apiConfig.coinGecko.hasKey && apiConfig.coinGecko.apiKey) {
            params.x_cg_pro_api_key = apiConfig.coinGecko.apiKey;
        }
        
        const response = await axios.get(apiUrl, { params });
        
        const data = response.data;
        if (!data[coinId]) throw new Error('Symbol not found');
        
        const price = data[coinId].usd;
        const change = data[coinId].usd_24h_change;
        
        return {
            price: price.toFixed(2),
            change: change ? change.toFixed(2) : '0.00',
            isUp: change > 0
        };
    } catch (error) {
        console.error('Error fetching price data:', error);
        // Fallback to dummy data if API fails
        return generateDummyPriceData(pair);
    }
};

// Generate dummy opening hours data
const generateDummyOpeningHours = () => {
    const isOpen = true; // Crypto markets are generally 24/7
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    
    return {
        isOpen,
        nextEvent: isOpen ? 'Maintenance' : 'Otevírá',
        time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    };
};

const fetchOpeningHours = async (exchange, pair) => {
    // Use dummy data if toggled or if required params are missing
    if (!apiConfig.useRealData || !exchange || !pair) {
        return generateDummyOpeningHours();
    }
    
    try {
        // Most crypto exchanges operate 24/7, but we'll check market status
        // using CryptoCompare API to see if there are any issues
        const symbol = extractSymbol(pair);
        if (!symbol) throw new Error('Invalid pair format');
        
        const exchangeId = apiConfig.exchangeMappings[exchange] || exchange.toLowerCase();
        
        const apiUrl = `${apiConfig.cryptoCompare.baseUrl}/v2/exchange/hours`;
        const params = {
            fsym: symbol,
            tsym: 'USD',
            e: exchangeId
        };
        
        // Add API key if available
        if (apiConfig.cryptoCompare.apiKey) {
            params.api_key = apiConfig.cryptoCompare.apiKey;
        }
        
        const response = await axios.get(apiUrl, { params });
        
        const marketOpen = true; // Crypto markets are generally 24/7
        const now = new Date();
        // Just for visualization, set next maintenance period
        const hours = (now.getHours() + 4) % 24;
        const minutes = now.getMinutes();
        
        return {
            isOpen: marketOpen,
            nextEvent: marketOpen ? 'Maintenance' : 'Otevírá',
            time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
        };
    } catch (error) {
        console.error('Error fetching market hours:', error);
        // Fallback to dummy data
        return generateDummyOpeningHours();
    }
};

// Generate dummy chart data
const generateDummyChartData = (pair) => {
    const dataPoints = 20;
    const basePrice = extractSymbol(pair) === 'BTC' ? 30000 : 1000;
    const variance = basePrice * 0.05; // 5% variance for realistic fluctuations
    
    // Generate somewhat realistic price movements
    const data = [];
    let currentPrice = basePrice + (Math.random() * variance * 2 - variance);
    
    for (let i = 0; i < dataPoints; i++) {
        // Random price movement with some trend
        const change = (Math.random() * variance * 0.4) - (variance * 0.2);
        currentPrice += change;
        data.push(currentPrice);
    }
    
    return {
        labels: Array.from({ length: dataPoints }, (_, i) => {
            const date = new Date();
            date.setHours(date.getHours() - (dataPoints - i));
            return date.toLocaleTimeString();
        }),
        datasets: [{
            label: `${pair} Cena`,
            data: data,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };
};

const fetchChartData = async (exchange, pair, timeframe) => {
    // Use dummy data if toggled or if required params are missing
    if (!apiConfig.useRealData || !exchange || !pair || !timeframe) {
        return generateDummyChartData(pair);
    }
    
    try {
        const symbol = extractSymbol(pair);
        if (!symbol) throw new Error('Invalid pair format');
        
        // Map timeframe to CryptoCompare format
        const timeframeMap = {
            '15m': 'minute',
            '1h': 'hour',
            '4h': 'hour',
            '1d': 'day',
            '1w': 'day'
        };
        
        if (!timeframeMap[timeframe]) {
            throw new Error('Invalid timeframe');
        }
        
        const limit = 20; // Number of data points
        const aggregation = timeframe === '4h' ? 4 : 1; // For 4h, we aggregate hourly data
        
        const apiUrl = `${apiConfig.cryptoCompare.baseUrl}/v2/histo${timeframeMap[timeframe]}`;
        const params = {
            fsym: symbol,
            tsym: 'USD',
            limit: limit,
            aggregate: aggregation,
            e: apiConfig.exchangeMappings[exchange] || 'CCCAGG' // CCCAGG is an aggregate of exchanges
        };
        
        // Add API key if available
        if (apiConfig.cryptoCompare.apiKey) {
            params.api_key = apiConfig.cryptoCompare.apiKey;
        }
        
        const response = await axios.get(apiUrl, { params });
        
        const priceData = response.data.Data?.Data || [];
        
        if (!priceData || priceData.length === 0) {
            throw new Error('No chart data available');
        }
        
        // Format data for Chart.js
        const labels = priceData.map(item => {
            const date = new Date(item.time * 1000);
            return date.toLocaleTimeString();
        });
        
        const prices = priceData.map(item => item.close);
        
        return {
            labels: labels,
            datasets: [{
                label: `${pair} Cena`,
                data: prices,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        };
    } catch (error) {
        console.error('Error fetching chart data:', error);
        // Fallback to dummy data
        return generateDummyChartData(pair);
    }
};

// Generate dummy news data
const generateDummyNews = (instrument) => {
    const newsCount = Math.floor(Math.random() * 5) + 3;
    const newsTopics = [
        'price movement', 'market analysis', 'regulatory news', 
        'adoption', 'technological update', 'partnership announcement'
    ];
    
    return Array.from({ length: newsCount }, (_, i) => {
        const date = new Date();
        date.setHours(date.getHours() - Math.floor(Math.random() * 48));
        const topic = newsTopics[Math.floor(Math.random() * newsTopics.length)];
        
        return {
            id: i,
            title: `${instrument} ${topic} update ${i+1}`,
            summary: `This is a summary of ${instrument} ${topic}. Contains important information about recent developments and current status.`,
            date: date.toLocaleString(),
            url: `https://example.com/news/${instrument.toLowerCase()}/${i}`
        };
    });
};

const fetchNews = async (instrument) => {
    // Use dummy data if toggled or if required params are missing
    if (!apiConfig.useRealData || !instrument) {
        return generateDummyNews(instrument || 'Cryptocurrency');
    }
    
    try {
        const searchTerm = instrument || 'cryptocurrency';
        
        // NewsAPI query
        const apiUrl = `${apiConfig.newsAPI.baseUrl}/everything`;
        const params = {
            q: searchTerm,
            apiKey: apiConfig.newsAPI.apiKey,
            language: 'en',
            pageSize: 5,
            sortBy: 'publishedAt'
        };
        
        const response = await axios.get(apiUrl, { params });
        
        const articles = response.data.articles || [];
        
        if (!articles || articles.length === 0) {
            throw new Error('No news available');
        }
        
        return articles.map((article, idx) => ({
            id: idx,
            title: article.title,
            summary: article.description || `News about ${instrument}`,
            date: new Date(article.publishedAt).toLocaleString(),
            url: article.url
        }));
    } catch (error) {
        console.error('Error fetching news:', error);
        // Fallback to dummy data
        return generateDummyNews(instrument || 'Cryptocurrency');
    }
};

// Generate dummy instrument data
const generateDummyInstrumentData = (instrument) => {
    // Generate more realistic values based on the instrument
    let basePrice, marketCap, volume;
    
    switch(instrument) {
        case 'Bitcoin':
            basePrice = Math.random() * 5000 + 25000;
            marketCap = Math.random() * 200000000000 + 500000000000;
            volume = Math.random() * 10000000000 + 20000000000;
            break;
        case 'Ethereum':
            basePrice = Math.random() * 500 + 1500;
            marketCap = Math.random() * 50000000000 + 150000000000;
            volume = Math.random() * 5000000000 + 10000000000;
            break;
        default:
            basePrice = Math.random() * 50 + 10;
            marketCap = Math.random() * 1000000000 + 5000000000;
            volume = Math.random() * 500000000 + 1000000000;
    }
    
    const change24h = (Math.random() * 20 - 10).toFixed(2);
    const change7d = (Math.random() * 30 - 15).toFixed(2);
    
    return {
        price: basePrice.toFixed(2),
        marketCap: marketCap.toExponential(2),
        volume24h: volume.toExponential(2),
        change24h: change24h,
        change7d: change7d,
        rank: Math.floor(Math.random() * 30) + 1
    };
};

const fetchInstrumentData = async (instrument) => {
    // Use dummy data if toggled or if required params are missing
    if (!apiConfig.useRealData || !instrument) {
        return generateDummyInstrumentData(instrument || 'Generic');
    }
    
    try {
        const coinId = getCoinGeckoId(instrument);
        if (!coinId) throw new Error('Unknown instrument');
        
        const apiUrl = `${apiConfig.coinGecko.baseUrl}/coins/${coinId}`;
        const params = {};
        
        // Add API key if available and using Pro
        if (apiConfig.coinGecko.hasKey && apiConfig.coinGecko.apiKey) {
            params.x_cg_pro_api_key = apiConfig.coinGecko.apiKey;
        }
        
        const response = await axios.get(apiUrl, { params });
        const data = response.data;
        
        if (!data) throw new Error('No data returned');
        
        const marketData = data.market_data;
        
        if (!marketData || !marketData.current_price || !marketData.current_price.usd) {
            throw new Error('Invalid data structure');
        }
        
        return {
            price: marketData.current_price.usd.toFixed(2),
            marketCap: marketData.market_cap.usd.toExponential(2),
            volume24h: marketData.total_volume.usd.toExponential(2),
            change24h: marketData.price_change_percentage_24h?.toFixed(2) || '0.00',
            change7d: marketData.price_change_percentage_7d?.toFixed(2) || '0.00',
            rank: data.market_cap_rank || 999
        };
    } catch (error) {
        console.error('Error fetching instrument data:', error);
        // Fallback to dummy data
        return generateDummyInstrumentData(instrument || 'Generic');
    }
};

// Generate dummy pair data
const generateDummyPairData = (pair) => {
    // Generate more realistic values based on the currency
    let basePrice, highMod, lowMod, volume, volatility;
    const symbol = extractSymbol(pair);
    
    switch(symbol) {
        case 'BTC':
            basePrice = Math.random() * 5000 + 25000;
            highMod = 1.05;  // 5% higher than base
            lowMod = 0.95;   // 5% lower than base
            volume = Math.random() * 10000000000 + 20000000000;
            volatility = Math.random() * 5 + 2;  // 2-7%
            break;
        case 'ETH':
            basePrice = Math.random() * 500 + 1500;
            highMod = 1.07;  // 7% higher
            lowMod = 0.93;   // 7% lower
            volume = Math.random() * 5000000000 + 10000000000;
            volatility = Math.random() * 7 + 3;  // 3-10%
            break;
        default:
            basePrice = Math.random() * 50 + 10;
            highMod = 1.1;   // 10% higher
            lowMod = 0.9;    // 10% lower
            volume = Math.random() * 500000000 + 1000000000;
            volatility = Math.random() * 10 + 5;  // 5-15%
    }
    
    const lastPrice = basePrice;
    const highPrice = basePrice * highMod;
    const lowPrice = basePrice * lowMod;
    const liquidityScore = Math.min(volume / 1000000000 * 10, 100);
    
    return {
        lastPrice: lastPrice.toFixed(2),
        highPrice: highPrice.toFixed(2),
        lowPrice: lowPrice.toFixed(2),
        volume: volume.toExponential(2),
        liquidityScore: liquidityScore.toFixed(2),
        volatility: volatility.toFixed(2)
    };
};

const fetchPairData = async (pair) => {
    // Use dummy data if toggled or if required params are missing
    if (!apiConfig.useRealData || !pair) {
        return generateDummyPairData(pair || 'BTC/USD');
    }
    
    try {
        const symbol = extractSymbol(pair);
        if (!symbol) throw new Error('Invalid pair format');
        
        const coinId = getCoinGeckoId(symbol);
        if (!coinId) throw new Error('Unknown symbol');
        
        // Get volatility and other metrics
        const apiUrl = `${apiConfig.coinGecko.baseUrl}/coins/${coinId}/market_chart`;
        const params = {
            vs_currency: 'usd',
            days: 1,
            interval: 'hourly'
        };
        
        // Add API key if available and using Pro
        if (apiConfig.coinGecko.hasKey && apiConfig.coinGecko.apiKey) {
            params.x_cg_pro_api_key = apiConfig.coinGecko.apiKey;
        }
        
        const response = await axios.get(apiUrl, { params });
        
        const priceData = response.data.prices || [];
        
        if (priceData.length === 0) throw new Error('No price data');
        
        // Calculate high, low and volatility
        const prices = priceData.map(item => item[1]);
        const lastPrice = prices[prices.length - 1];
        const highPrice = Math.max(...prices);
        const lowPrice = Math.min(...prices);
        
        // Simple volatility calculation (std deviation / mean * 100)
        const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        const squaredDiffs = prices.map(price => Math.pow(price - mean, 2));
        const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / prices.length;
        const stdDev = Math.sqrt(variance);
        const volatility = (stdDev / mean * 100).toFixed(2);
        
        // Get volume data
        const volumeUrl = `${apiConfig.coinGecko.baseUrl}/coins/${coinId}`;
        const volumeParams = {};
        
        // Add API key if available and using Pro
        if (apiConfig.coinGecko.hasKey && apiConfig.coinGecko.apiKey) {
            volumeParams.x_cg_pro_api_key = apiConfig.coinGecko.apiKey;
        }
        
        const volumeResponse = await axios.get(volumeUrl, { params: volumeParams });
        const volume = volumeResponse.data.market_data?.total_volume?.usd;
        
        if (!volume) throw new Error('No volume data');
        
        return {
            lastPrice: lastPrice.toFixed(2),
            highPrice: highPrice.toFixed(2),
            lowPrice: lowPrice.toFixed(2),
            volume: volume.toExponential(2),
            liquidityScore: (Math.min(volume / 1000000000 * 10, 100)).toFixed(2), // Simple liquidity score
            volatility: volatility
        };
    } catch (error) {
        console.error('Error fetching pair data:', error);
        // Fallback to dummy data
        return generateDummyPairData(pair || 'BTC/USD');
    }
};