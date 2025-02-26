// Modul pro graf páru
const PairChart = ({ config }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    
    // Use React Query to fetch chart data
    const { data, isLoading, isError } = useQuery(
        ['chartData', config.exchange, config.pair, config.timeframe || '1d'],
        () => fetchChartData(config.exchange, config.pair, config.timeframe || '1d'),
        {
            refetchInterval: 60000, // Refresh every minute
            staleTime: 30000, // Consider data stale after 30 seconds
        }
    );
    
    // Create or update chart when data changes
    useEffect(() => {
        if (isLoading || isError || !chartRef.current || !data) return;
        
        // Destroy existing chart if it exists
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        
        // Create new chart
        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
        
        // Cleanup on unmount
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, isLoading, isError]);
    
    return (
        <div className="module">
            <div className="module-header">
                <h5>{config.title || `${config.exchange} - ${config.pair} Graf`}</h5>
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
                <div style={{ height: '200px' }}>
                    <canvas ref={chartRef}></canvas>
                </div>
            )}
        </div>
    );
};