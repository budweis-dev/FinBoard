// Modul pro otevírací hodiny páru
const OpeningHours = ({ config }) => {
    // Use React Query to fetch data
    const { data, isLoading, isError } = useQuery(
        ['marketHours', config.exchange, config.pair],
        () => fetchOpeningHours(config.exchange, config.pair),
        {
            refetchInterval: 60000, // Refresh every minute
            staleTime: 30000, // Consider data stale after 30 seconds
        }
    );
    
    return (
        <div className="module">
            <div className="module-header">
                <h5>{config.title || `${config.exchange} - ${config.pair} Otevírací hodiny`}</h5>
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
                    <div className="fs-4 mb-2">
                        Status: <span className={data.isOpen ? 'text-success' : 'text-danger'}>
                            {data.isOpen ? 'Otevřeno' : 'Zavřeno'}
                        </span>
                    </div>
                    <div>
                        {data.nextEvent} v {data.time}
                    </div>
                </div>
            )}
        </div>
    );
};