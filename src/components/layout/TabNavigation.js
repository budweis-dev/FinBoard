const TabNavigation = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <ul className="nav nav-tabs mb-4">
            {tabs.map(tab => (
                <li className="nav-item" key={tab.id}>
                    <button 
                        className={`nav-link ${activeTab === tab.id ? 'active' : ''}`} 
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.name}
                    </button>
                </li>
            ))}
        </ul>
    );
};