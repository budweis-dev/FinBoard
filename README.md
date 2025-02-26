# Trading Dashboard

Interactive web dashboard for displaying real-time cryptocurrency trading data. Built with HTML, CSS, JavaScript, React, Bootstrap, and React Query.

## Features

- Live cryptocurrency data from public APIs
- Multiple customizable dashboard tabs
- Various widget modules: price tickers, charts, news feeds, etc.
- Admin interface for adding, configuring, and removing modules
- Export/import dashboard configuration as JSON
- Responsive layout with grid system
- Persistent configuration using browser's localStorage
- Real-time data updates with React Query

## Project Structure

```
tradindBoard/
├── public/
│   └── index.html        # Main HTML file
├── src/
│   ├── components/       # React components
│   │   ├── layout/       # Layout components
│   │   └── modules/      # Dashboard module components
│   ├── services/         # Data services and API integrations
│   ├── styles/           # CSS files
│   ├── utils/            # Utility functions
│   ├── App.js            # Main application component
│   └── index.js          # Entry point
├── package.json          # Project configuration
└── README.md             # Project documentation
```

## API Integrations

The dashboard integrates with several public cryptocurrency APIs:

- **CoinGecko API**: For price data, market information, and historical charts
- **CryptoCompare API**: For additional market data and exchange information
- **NewsAPI**: For cryptocurrency news articles

All API calls are managed using React Query for efficient caching, background refetching, and better user experience.

## Getting Started

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server
4. Open your browser at the URL shown in the console

## Customization

The dashboard is fully customizable. You can:

- Create new tabs
- Add/remove modules to each tab
- Configure each module with custom settings
- Export your configuration to share or backup
- Import previously exported configurations

## Data Refresh Rates

Different components have different refresh rates:

- Price tickers: Every 10 seconds
- Charts: Every 60 seconds
- News: Every 5 minutes
- Market data: Every 30 seconds