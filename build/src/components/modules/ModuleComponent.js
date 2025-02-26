// Komponenta pro modul podle typu
const ModuleComponent = ({ module }) => {
    switch(module.type) {
        case 'price-ticker':
            return <PriceTicker config={module.config} />;
        case 'opening-hours':
            return <OpeningHours config={module.config} />;
        case 'pair-chart':
            return <PairChart config={module.config} />;
        case 'news-feed':
            return <NewsFeed config={module.config} />;
        case 'instrument-dashboard':
            return <InstrumentDashboard config={module.config} />;
        case 'pair-dashboard':
            return <PairDashboard config={module.config} />;
        default:
            return <div className="module">Neznámý typ modulu</div>;
    }
};