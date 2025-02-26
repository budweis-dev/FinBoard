// Modul pro dashboard instrumentu
const InstrumentDashboard = ({ config }) => {
    // Use React Query to fetch instrument data
    const { data, isLoading, isError } = useQuery(
        ['instrumentData', config.instrument],
        () => fetchInstrumentData(config.instrument),
        {
            refetchInterval: 30000, // Refresh every 30 seconds
            staleTime: 15000, // Consider data stale after 15 seconds
        }
    );
    
    return (
        <div className="module">
            <div className="module-header">
                <h5>{config.title || `${config.instrument} Dashboard`}</h5>
            </div>
            {isLoading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Načítání...</span>
                    </div>
                </div>
            ) : isError ? (
                <div className="text-center text-danger">
                    <p>Chyba při načítání dat</p>
                </div>
            ) : (
                <div className="dashboard-container">
                    <div className="dashboard-item">
                        <span>Cena:</span>
                        <span>${data.price}</span>
                    </div>
                    <div className="dashboard-item">
                        <span>Tržní kapitalizace:</span>
                        <span>${data.marketCap}</span>
                    </div>
                    <div className="dashboard-item">
                        <span>Objem 24h:</span>
                        <span>${data.volume24h}</span>
                    </div>
                    <div className="dashboard-item">
                        <span>Změna 24h:</span>
                        <span className={parseFloat(data.change24h) > 0 ? 'text-success' : 'text-danger'}>
                            {parseFloat(data.change24h) > 0 ? '+' : ''}{data.change24h}%
                        </span>
                    </div>
                    <div className="dashboard-item">
                        <span>Změna 7d:</span>
                        <span className={parseFloat(data.change7d) > 0 ? 'text-success' : 'text-danger'}>
                            {parseFloat(data.change7d) > 0 ? '+' : ''}{data.change7d}%
                        </span>
                    </div>
                    <div className="dashboard-item">
                        <span>Pořadí:</span>
                        <span>#{data.rank}</span>
                    </div>
                </div>
            )}
        </div>
    );
};