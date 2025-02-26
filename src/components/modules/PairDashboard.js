// Modul pro dashboard páru
const PairDashboard = ({ config }) => {
    // Use React Query to fetch pair data
    const { data, isLoading, isError } = useQuery(
        ['pairData', config.pair],
        () => fetchPairData(config.pair),
        {
            refetchInterval: 30000, // Refresh every 30 seconds
            staleTime: 15000, // Consider data stale after 15 seconds
        }
    );
    
    return (
        <div className="module">
            <div className="module-header">
                <h5>{config.title || `${config.pair} Dashboard`}</h5>
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
                        <span>Poslední cena:</span>
                        <span>${data.lastPrice}</span>
                    </div>
                    <div className="dashboard-item">
                        <span>Nejvyšší cena 24h:</span>
                        <span>${data.highPrice}</span>
                    </div>
                    <div className="dashboard-item">
                        <span>Nejnižší cena 24h:</span>
                        <span>${data.lowPrice}</span>
                    </div>
                    <div className="dashboard-item">
                        <span>Objem 24h:</span>
                        <span>${data.volume}</span>
                    </div>
                    <div className="dashboard-item">
                        <span>Skóre likvidity:</span>
                        <span>{data.liquidityScore}%</span>
                    </div>
                    <div className="dashboard-item">
                        <span>Volatilita:</span>
                        <span>{data.volatility}%</span>
                    </div>
                </div>
            )}
        </div>
    );
};