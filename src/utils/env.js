// Environment variable handling
const getEnv = (key, defaultValue = '') => {
    // In a typical React app, we would use process.env,
    // but since we're using script imports in a browser,
    // we're creating a workaround

    // Global object to store environment values
    if (!window._env) {
        window._env = {
            COINGECKO_API_KEY: '',
            CRYPTOCOMPARE_API_KEY: '',
            NEWSAPI_API_KEY: '8c3fb4fd9bef4a86a2dd1e4ec00b32bf',
            ALPHAVANTAGE_API_KEY: 'demo'
        };
    }
    
    return window._env[key] || defaultValue;
};