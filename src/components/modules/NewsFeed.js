// Modul pro zprávy o instrumentu
const NewsFeed = ({ config }) => {
    // Use React Query to fetch news data
    const { data: news, isLoading, isError } = useQuery(
        ['news', config.instrument],
        () => fetchNews(config.instrument),
        {
            refetchInterval: 300000, // Refresh every 5 minutes
            staleTime: 180000, // Consider data stale after 3 minutes
        }
    );
    
    return (
        <div className="module">
            <div className="module-header">
                <h5>{config.title || `${config.instrument} Zprávy`}</h5>
            </div>
            {isLoading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Načítání...</span>
                    </div>
                </div>
            ) : isError ? (
                <div className="text-center text-danger">
                    <p>Chyba při načítání zpráv</p>
                </div>
            ) : (
                <div className="news-container">
                    {news.map(item => (
                        <div key={item.id} className="news-item">
                            <div className="news-date">{item.date}</div>
                            <div className="news-title fw-bold">{item.title}</div>
                            <div className="news-summary">{item.summary}</div>
                            {item.url && (
                                <div className="mt-1">
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                        Číst více
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};