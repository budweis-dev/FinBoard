const AdminPanel = ({ 
    tabs, 
    activeTab, 
    setActiveTab,
    newTabName, 
    setNewTabName,
    moduleFormData, 
    updateModuleForm,
    updateModuleConfig,
    addTab,
    removeTab,
    addModule,
    removeModule,
    exportConfig,
    importConfig,
    toggleDataSource,
    useRealData
}) => {
    return (
        <div className="admin-panel mb-4">
            <h4>Administrace</h4>
            
            <div className="card mb-3">
                <div className="card-header">
                    <h5>Správa Tabů</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-8 mb-3">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Název nového tabu" 
                                value={newTabName}
                                onChange={(e) => setNewTabName(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4 mb-3">
                            <button className="btn btn-success w-100" onClick={addTab}>
                                Přidat Tab
                            </button>
                        </div>
                    </div>
                    
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Název</th>
                                    <th>Počet modulů</th>
                                    <th>Akce</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tabs.map(tab => (
                                    <tr key={tab.id}>
                                        <td>{tab.name}</td>
                                        <td>{tab.modules.length}</td>
                                        <td>
                                            <button 
                                                className="btn btn-sm btn-danger"
                                                onClick={() => removeTab(tab.id)}
                                            >
                                                Odstranit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div className="card mb-3">
                <div className="card-header">
                    <h5>Přidat Modul</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Tab</label>
                            <select 
                                className="form-select" 
                                value={moduleFormData.tabId || activeTab || ''}
                                onChange={(e) => updateModuleForm('tabId', e.target.value)}
                            >
                                {tabs.map(tab => (
                                    <option key={tab.id} value={tab.id}>{tab.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Typ Modulu</label>
                            <select 
                                className="form-select" 
                                value={moduleFormData.type}
                                onChange={(e) => updateModuleForm('type', e.target.value)}
                            >
                                <option value="price-ticker">Cena Páru</option>
                                <option value="opening-hours">Otevírací Hodiny</option>
                                <option value="pair-chart">Graf Páru</option>
                                <option value="news-feed">Zprávy</option>
                                <option value="instrument-dashboard">Dashboard Instrumentu</option>
                                <option value="pair-dashboard">Dashboard Páru</option>
                            </select>
                        </div>
                        
                        <div className="col-md-12 mb-3">
                            <label className="form-label">Název Modulu</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Volitelný název modulu" 
                                value={moduleFormData.title}
                                onChange={(e) => updateModuleForm('title', e.target.value)}
                            />
                        </div>
                        
                        <div className="col-12 mb-3">
                            <div className="alert alert-warning py-2">
                                <small><strong>Poznámka:</strong> Všechna pole označená * jsou povinná pro správnou funkci modulu.</small>
                            </div>
                        </div>
                        
                        {/* Dynamické formuláře podle typu modulu */}
                        {(moduleFormData.type === 'price-ticker' || 
                          moduleFormData.type === 'opening-hours' || 
                          moduleFormData.type === 'pair-chart') && (
                            <>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Burza *</label>
                                    <select 
                                        className={`form-select ${!moduleFormData.config.exchange ? 'border-danger' : ''}`}
                                        value={moduleFormData.config.exchange || ''}
                                        onChange={(e) => updateModuleConfig('exchange', e.target.value)}
                                    >
                                        <option value="">Vyberte burzu</option>
                                        {dummyExchanges.map(exchange => (
                                            <option key={exchange} value={exchange}>{exchange}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Pár *</label>
                                    <select 
                                        className={`form-select ${!moduleFormData.config.pair ? 'border-danger' : ''}`}
                                        value={moduleFormData.config.pair || ''}
                                        onChange={(e) => updateModuleConfig('pair', e.target.value)}
                                    >
                                        <option value="">Vyberte pár</option>
                                        {dummyPairs.map(pair => (
                                            <option key={pair} value={pair}>{pair}</option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                        
                        {moduleFormData.type === 'pair-chart' && (
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Časový rámec *</label>
                                <select 
                                    className="form-select" 
                                    value={moduleFormData.config.timeframe || '1d'}
                                    onChange={(e) => updateModuleConfig('timeframe', e.target.value)}
                                >
                                    <option value="15m">15 minut</option>
                                    <option value="1h">1 hodina</option>
                                    <option value="4h">4 hodiny</option>
                                    <option value="1d">1 den</option>
                                    <option value="1w">1 týden</option>
                                </select>
                            </div>
                        )}
                        
                        {(moduleFormData.type === 'news-feed' || 
                          moduleFormData.type === 'instrument-dashboard') && (
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Instrument *</label>
                                <select 
                                    className={`form-select ${!moduleFormData.config.instrument ? 'border-danger' : ''}`}
                                    value={moduleFormData.config.instrument || ''}
                                    onChange={(e) => updateModuleConfig('instrument', e.target.value)}
                                >
                                    <option value="">Vyberte instrument</option>
                                    {dummyInstruments.map(instrument => (
                                        <option key={instrument} value={instrument}>{instrument}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        
                        {moduleFormData.type === 'pair-dashboard' && (
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Pár *</label>
                                <select 
                                    className={`form-select ${!moduleFormData.config.pair ? 'border-danger' : ''}`}
                                    value={moduleFormData.config.pair || ''}
                                    onChange={(e) => updateModuleConfig('pair', e.target.value)}
                                >
                                    <option value="">Vyberte pár</option>
                                    {dummyPairs.map(pair => (
                                        <option key={pair} value={pair}>{pair}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        
                        <div className="col-12 mt-3">
                            <button 
                                className="btn btn-primary" 
                                onClick={addModule}
                                disabled={!moduleFormData.type || 
                                        (moduleFormData.type === 'price-ticker' && 
                                         (!moduleFormData.config.exchange || !moduleFormData.config.pair)) ||
                                        (moduleFormData.type === 'opening-hours' && 
                                         (!moduleFormData.config.exchange || !moduleFormData.config.pair)) ||
                                        (moduleFormData.type === 'pair-chart' && 
                                         (!moduleFormData.config.exchange || !moduleFormData.config.pair)) ||
                                        (moduleFormData.type === 'news-feed' && 
                                         !moduleFormData.config.instrument) ||
                                        (moduleFormData.type === 'instrument-dashboard' && 
                                         !moduleFormData.config.instrument) ||
                                        (moduleFormData.type === 'pair-dashboard' && 
                                         !moduleFormData.config.pair)
                                }
                            >
                                Přidat Modul
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="card mb-3">
                <div className="card-header">
                    <h5>Zdroj dat</h5>
                </div>
                <div className="card-body">
                    <div className="row align-items-center mb-3">
                        <div className="col-md-6">
                            <div className="form-check form-switch">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    id="dataSourceToggle"
                                    checked={useRealData}
                                    onChange={toggleDataSource}
                                />
                                <label className="form-check-label" htmlFor="dataSourceToggle">
                                    {useRealData ? 'Používat reálná data (API)' : 'Používat testovací data'}
                                </label>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="alert alert-info py-2 mb-0">
                                <small>{useRealData ? 
                                    'API data jsou omezena na určitý počet požadavků za minutu/den.' : 
                                    'Testovací data jsou generována náhodně.'}</small>
                            </div>
                        </div>
                    </div>
                    
                    {useRealData && (
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">CoinGecko API Key (volitelné)</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    placeholder="Pro veřejné API nechte prázdné"
                                    value={window._env.COINGECKO_API_KEY || ''} 
                                    onChange={(e) => window._env.COINGECKO_API_KEY = e.target.value}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">NewsAPI Key</label>
                                <input 
                                    type="password" 
                                    className="form-control"
                                    value={window._env.NEWSAPI_API_KEY || ''} 
                                    onChange={(e) => window._env.NEWSAPI_API_KEY = e.target.value}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="card">
                <div className="card-header">
                    <h5>Import/Export Konfigurace</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <button 
                                className="btn btn-info w-100" 
                                onClick={exportConfig}
                            >
                                Export JSON
                            </button>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="input-group">
                                <input 
                                    type="file" 
                                    className="form-control" 
                                    accept=".json" 
                                    onChange={importConfig}
                                />
                                <label className="input-group-text">Import JSON</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};