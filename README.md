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

## API Testing

The project includes a comprehensive API testing suite:

- **Command-line tests**: Run `node src/tests/runTests.js all` to test all API integrations
- **Browser-based tests**: Open `src/tests/apiTests.html` in your browser for interactive testing
- **Individual API tests**: Test specific APIs with commands like `node src/tests/runTests.js coingecko BTC`

For more details, see the [API Tests README](src/tests/README.md).

## Deployment

### GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions:

1. Push your changes to the main branch
2. GitHub Actions will automatically build and deploy the application
3. Access your deployed application at `https://[your-username].github.io/tradindBoard/`

To set up GitHub Pages deployment:

1. Fork or push this repository to your GitHub account
2. Go to repository Settings → Pages
3. Select "GitHub Actions" as the source
4. (Optional) Configure API keys as repository secrets in Settings → Secrets and variables → Actions

### Manual Deployment

To deploy manually:

1. Build the project: `npm run build`
2. Deploy the contents of the `build` directory to your web server

## Environment Variables

Create a `.env` file in the root directory with your API keys:

```
COINGECKO_API_KEY=your_key
ALPHAVANTAGE_API_KEY=your_key
NEWSAPI_API_KEY=your_key
CRYPTOCOMPARE_API_KEY=your_key
```

For GitHub Actions deployment, add these as repository secrets.

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