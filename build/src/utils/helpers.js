// Common data
const dummyExchanges = ['Binance', 'Coinbase', 'Kraken', 'Bitstamp'];
const dummyPairs = ['BTC/USD', 'ETH/USD', 'LTC/USD', 'XRP/USD', 'ADA/USD', 'DOT/USD'];
const dummyInstruments = ['Bitcoin', 'Ethereum', 'Litecoin', 'Ripple', 'Cardano', 'Polkadot'];

// Helper to generate unique IDs
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Local storage helpers
const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

const loadFromLocalStorage = (key, defaultValue = null) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
};