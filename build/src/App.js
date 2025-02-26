// Hlavní aplikace
// Explicitně definujeme React hooks
const { useState, useEffect, useRef } = React;

const App = () => {
    const [tabs, setTabs] = useState([]);
    const [activeTab, setActiveTab] = useState(null);
    const [showAdmin, setShowAdmin] = useState(false);
    const [newTabName, setNewTabName] = useState('');
    const [moduleFormData, setModuleFormData] = useState({
        tabId: '',
        type: 'price-ticker',
        title: '',
        config: {}
    });
    
    // Data source state (real API vs dummy data)
    const [useRealData, setUseRealData] = useState(apiConfig.useRealData);
    
    // Načtení dat z localStorage při spuštění
    useEffect(() => {
        const savedData = loadFromLocalStorage('dashboard-config');
        if (savedData) {
            try {
                setTabs(savedData.tabs || []);
                
                // Nastaví aktivní tab, pokud existují taby
                if (savedData.tabs && savedData.tabs.length > 0) {
                    setActiveTab(savedData.tabs[0].id);
                }
            } catch (error) {
                console.error('Chyba při načítání konfigurace:', error);
            }
        } else {
            // Defaultní konfigurace při prvním spuštění
            const defaultTabs = [
                {
                    id: generateId(),
                    name: 'Hlavní',
                    modules: [
                        {
                            id: generateId(),
                            type: 'price-ticker',
                            config: {
                                exchange: 'Binance',
                                pair: 'BTC/USD',
                                title: 'Bitcoin Cena'
                            }
                        },
                        {
                            id: generateId(),
                            type: 'pair-chart',
                            config: {
                                exchange: 'Binance',
                                pair: 'BTC/USD',
                                timeframe: '1d',
                                title: 'Bitcoin Graf'
                            }
                        },
                        {
                            id: generateId(),
                            type: 'news-feed',
                            config: {
                                instrument: 'Bitcoin',
                                title: 'Bitcoin Zprávy'
                            }
                        }
                    ]
                }
            ];
            
            setTabs(defaultTabs);
            setActiveTab(defaultTabs[0].id);
        }
    }, []);
    
    // Ukládání dat do localStorage
    useEffect(() => {
        if (tabs.length > 0) {
            saveToLocalStorage('dashboard-config', { tabs });
        }
    }, [tabs]);
    
    // Přidání nového tabu
    const addTab = () => {
        if (!newTabName.trim()) return;
        
        const newTab = {
            id: generateId(),
            name: newTabName,
            modules: []
        };
        
        setTabs([...tabs, newTab]);
        setNewTabName('');
        setActiveTab(newTab.id);
    };
    
    // Odstranění tabu
    const removeTab = (tabId) => {
        const updatedTabs = tabs.filter(tab => tab.id !== tabId);
        setTabs(updatedTabs);
        
        if (activeTab === tabId && updatedTabs.length > 0) {
            setActiveTab(updatedTabs[0].id);
        }
    };
    
    // Aktualizace modulu v daném tabu
    const updateModuleForm = (field, value) => {
        setModuleFormData(prev => {
            if (field === 'type') {
                // Reset config při změně typu
                return { ...prev, [field]: value, config: {} };
            }
            return { ...prev, [field]: value };
        });
    };
    
    // Aktualizace konfigurace modulu
    const updateModuleConfig = (field, value) => {
        setModuleFormData(prev => ({
            ...prev,
            config: {
                ...prev.config,
                [field]: value
            }
        }));
    };
    
    // Přidání nového modulu
    const addModule = () => {
        const targetTabId = moduleFormData.tabId || activeTab;
        if (!targetTabId) return;
        
        const updatedTabs = tabs.map(tab => {
            if (tab.id === targetTabId) {
                return {
                    ...tab,
                    modules: [
                        ...tab.modules,
                        {
                            id: generateId(),
                            type: moduleFormData.type,
                            config: {
                                ...moduleFormData.config,
                                title: moduleFormData.title
                            }
                        }
                    ]
                };
            }
            return tab;
        });
        
        setTabs(updatedTabs);
        
        // Reset formuláře
        setModuleFormData({
            tabId: '',
            type: 'price-ticker',
            title: '',
            config: {}
        });
    };
    
    // Odstranění modulu
    const removeModule = (tabId, moduleId) => {
        const updatedTabs = tabs.map(tab => {
            if (tab.id === tabId) {
                return {
                    ...tab,
                    modules: tab.modules.filter(module => module.id !== moduleId)
                };
            }
            return tab;
        });
        
        setTabs(updatedTabs);
    };
    
    // Export konfigurace do JSON
    const exportConfig = () => {
        const configData = JSON.stringify({ tabs }, null, 2);
        const blob = new Blob([configData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dashboard-config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    // Import konfigurace z JSON
    const importConfig = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result);
                if (config && config.tabs) {
                    setTabs(config.tabs);
                    if (config.tabs.length > 0) {
                        setActiveTab(config.tabs[0].id);
                    }
                }
            } catch (error) {
                alert('Chyba při importu konfigurace: ' + error.message);
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = null;
    };
    
    // Toggle between real API data and dummy data
    const toggleDataSource = () => {
        const newValue = apiConfig.toggleDataSource();
        setUseRealData(newValue);
        
        // Invalidate all queries to force refetch with new data source
        queryClient.invalidateQueries();
    };
    
    // Současný aktivní tab
    const currentTab = tabs.find(tab => tab.id === activeTab);
    
    return (
        <div className="container-fluid py-3">
            <header className="d-flex justify-content-between align-items-center mb-4">
                <h2>Dashboard Aplikace</h2>
                <button 
                    className="btn btn-primary" 
                    onClick={() => setShowAdmin(!showAdmin)}
                >
                    {showAdmin ? 'Zavřít Administraci' : 'Administrace'}
                </button>
            </header>
            
            {showAdmin && (
                <AdminPanel 
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    newTabName={newTabName}
                    setNewTabName={setNewTabName}
                    moduleFormData={moduleFormData}
                    updateModuleForm={updateModuleForm}
                    updateModuleConfig={updateModuleConfig}
                    addTab={addTab}
                    removeTab={removeTab}
                    addModule={addModule}
                    removeModule={removeModule}
                    exportConfig={exportConfig}
                    importConfig={importConfig}
                    toggleDataSource={toggleDataSource}
                    useRealData={useRealData}
                />
            )}
            
            {/* Navigace mezi taby */}
            <TabNavigation 
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            
            {/* Obsah aktivního tabu */}
            {currentTab ? (
                currentTab.modules.length > 0 ? (
                    <div className="grid-container">
                        {currentTab.modules.map(module => (
                            <div key={module.id} className="position-relative">
                                <ModuleComponent module={module} />
                                {showAdmin && (
                                    <button 
                                        className="btn btn-sm btn-danger position-absolute"
                                        style={{ top: '5px', right: '5px' }}
                                        onClick={() => removeModule(currentTab.id, module.id)}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-5">
                        <p className="mb-3">Tento tab zatím nemá žádné moduly.</p>
                        <button 
                            className="btn btn-primary"
                            onClick={() => setShowAdmin(true)}
                        >
                            Přidat moduly
                        </button>
                    </div>
                )
            ) : (
                <div className="text-center p-5">
                    <p className="mb-3">Zatím nejsou přidány žádné taby.</p>
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowAdmin(true)}
                    >
                        Přidat taby
                    </button>
                </div>
            )}
        </div>
    );
};

// Globální export pro přístup v HTML
window.App = App;
