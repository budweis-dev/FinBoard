// Dynamic Script Loader
console.log('Script loader initializing...');

// Detekce, zda jsme na GitHub Pages nebo lokálně
const isGitHubPages = window.location.hostname.includes('github.io') || (window.GITHUB_PAGES === true);

// Nastavení base path podle prostředí
// Pozor: Název repozitáře na GitHub Pages musí přesně odpovídat (včetně velikosti písmen)
window.basePath = isGitHubPages ? '/FinBoard' : '';
console.log('Environment:', isGitHubPages ? 'GitHub Pages' : 'Local');
console.log('Base Path:', window.basePath);

// Helper funkce pro získání správné cesty k souborům
window.getPath = (path) => {
    // Odstraníme úvodní lomítko, pokud existuje
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const fullPath = `${window.basePath}/${cleanPath}`;
    return fullPath;
};

// Seznam všech skriptů, které je třeba načíst
const scripts = [
    // Utils
    'src/utils/env.js',
    'src/utils/helpers.js',
    
    // Components - Layout
    'src/components/layout/TabNavigation.js',
    'src/components/layout/AdminPanel.js',
    
    // Components - Modules
    'src/components/modules/ModuleComponent.js',
    'src/components/modules/PairChart.js',
    'src/components/modules/PairDashboard.js',
    'src/components/modules/PriceTicker.js',
    'src/components/modules/NewsFeed.js',
    'src/components/modules/OpeningHours.js',
    'src/components/modules/InstrumentDashboard.js',
    
    // Services
    'src/services/apiConfig.js',
    'src/services/dataService.js',
    
    // Main App
    'src/App.js'
];

// Funkce pro dynamické načtení skriptu
function loadScript(src, index) {
    return new Promise((resolve, reject) => {
        console.log(`Loading script ${index + 1}/${scripts.length}: ${src}`);
        const script = document.createElement('script');
        script.type = 'text/babel';
        script.src = window.getPath(src);
        script.async = false; // Načítání v pořadí
        
        script.onload = () => {
            console.log(`Script loaded: ${src}`);
            resolve();
        };
        
        script.onerror = (e) => {
            console.error(`Error loading script: ${src}`, e);
            reject(e);
        };
        
        document.head.appendChild(script);
    });
}

// Funkce pro načtení všech skriptů v pořadí
async function loadAllScripts() {
    console.log('Starting to load all scripts...');
    try {
        for (let i = 0; i < scripts.length; i++) {
            await loadScript(scripts[i], i);
        }
        console.log('All scripts loaded successfully!');
        // Inicializace aplikace po načtení všech skriptů
        initializeApp();
    } catch (error) {
        console.error('Failed to load all scripts:', error);
    }
}

// Funkce pro inicializaci aplikace
function initializeApp() {
    console.log('Initializing application...');
    // Toto odpovídá kódu z index.js
    try {
        // Definice React hooks
        const { useState, useEffect, useRef } = React;
        
        // Pokud máme QueryClientProvider a queryClient, použijeme je
        if (window.QueryClientProvider && window.queryClient) {
            ReactDOM.render(
                React.createElement(
                    window.QueryClientProvider,
                    { client: window.queryClient },
                    React.createElement(window.App || App)
                ),
                document.getElementById('root')
            );
        } else {
            // Fallback - vykreslíme jen App
            ReactDOM.render(
                React.createElement(window.App || App),
                document.getElementById('root')
            );
        }
        console.log('Application initialized!');
    } catch (e) {
        console.error('Failed to initialize application:', e);
    }
}

// Počkáme na načtení DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, loading scripts...');
    loadAllScripts();
});

// Záložní možnost, kdyby DOMContentLoaded už proběhlo
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    console.log('DOM already loaded, loading scripts...');
    loadAllScripts();
}
