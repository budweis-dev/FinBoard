// Modul pro cenu páru
const PriceTicker = ({ config }) => {
    // Use React Query to fetch data
    const { data, isLoading, isError } = useQuery(
        ['priceData', config.exchange, config.pair],
        () => fetchPriceData(config.exchange, config.pair),
        {
            refetchInterval: 10000, // Refresh every 10 seconds
            staleTime: 5000, // Consider data stale after 5 seconds
        }
    );
    
    return (
        <div className="module">
            <div className="module-header">
                <h5>{config.title || `${config.exchange} - ${config.pair} Cena`}</h5>
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
                <div className="text-center">
                    <div className="ticker-value">${data.price}</div>
                    <div className={`ticker-change ${data.isUp ? 'ticker-up' : 'ticker-down'}`}>
                        {data.isUp ? '▲' : '▼'} {data.change}%
                    </div>
                </div>
            )}
        </div>
    );
};