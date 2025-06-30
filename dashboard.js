// Function to fetch data from your Google Cloud Function backend
async function fetchData() {
    // IMPORTANT: Replace 'YOUR_CLOUD_FUNCTION_URL' with the actual HTTP trigger URL
    // you get after deploying your Google Cloud Function.
    const backendUrl = 'YOUR_CLOUD_FUNCTION_URL'; // e.g., https://us-central1-market-dashboard-464422.cloudfunctions.net/fetch_market_data

    try {
        const response = await fetch(backendUrl);
        if (!response.ok) {
            // Handle HTTP errors (e.g., 404, 500)
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data from backend:", error);
        throw error; // Re-throw to be caught by the calling function
    }
}

// Function to format numbers with appropriate decimals
function formatValue(key, value) {
    if (key.includes('pe') || key.includes('ey')) {
        return value.toFixed(2); // P/E and Earnings Yield
    } else if (key.includes('cpi') || key.includes('unemp') || key.includes('ffr')) {
        return value.toFixed(1) + '%'; // Percentages like CPI, Unemployment, FFR
    } else if (key.includes('yield') || key.includes('spread')) {
        return value.toFixed(2) + '%'; // Yields and spreads
    } else if (key.includes('value')) {
        return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // General values
    }
    return value.toString();
}

// Function to update the dashboard UI with fetched data
function updateDashboard(data) {
    // Equities
    document.getElementById('spx-value').textContent = formatValue('spx-value', data.equities.spx.value);
    document.getElementById('spx-change').textContent = `${data.equities.spx.change.toFixed(2)} (${(data.equities.spx.changePercent * 100).toFixed(2)}%)`;
    document.getElementById('spx-change').className = `metric-change ${data.equities.spx.change >= 0 ? 'positive' : 'negative'}`;

    document.getElementById('ixic-value').textContent = formatValue('ixic-value', data.equities.ixic.value);
    document.getElementById('ixic-change').textContent = `${data.equities.ixic.change.toFixed(2)} (${(data.equities.ixic.changePercent * 100).toFixed(2)}%)`;
    document.getElementById('ixic-change').className = `metric-change ${data.equities.ixic.change >= 0 ? 'positive' : 'negative'}`;

    document.getElementById('djia-value').textContent = formatValue('djia-value', data.equities.djia.value);
    document.getElementById('djia-change').textContent = `${data.equities.djia.change.toFixed(2)} (${(data.equities.djia.changePercent * 100).toFixed(2)}%)`;
    document.getElementById('djia-change').className = `metric-change ${data.equities.djia.change >= 0 ? 'positive' : 'negative'}`;

    document.getElementById('spx-pe-value').textContent = formatValue('spx-pe', data.equities.spx_pe.value);
    document.getElementById('spx-pe-change').textContent = `${data.equities.spx_pe.change.toFixed(2)} (${(data.equities.spx_pe.changePercent * 100).toFixed(2)}%)`;
    document.getElementById('spx-pe-change').className = `metric-change ${data.equities.spx_pe.change >= 0 ? 'positive' : 'negative'}`;

    document.getElementById('spx-ey-value').textContent = formatValue('spx-ey', data.equities.spx_ey.value);
    document.getElementById('spx-ey-change').textContent = `${data.equities.spx_ey.change.toFixed(2)} (${(data.equities.spx_ey.changePercent * 100).toFixed(2)}%)`;
    document.getElementById('spx-ey-change').className = `metric-change ${data.equities.spx_ey.change >= 0 ? 'positive' : 'negative'}`;

    // Fixed Income
    document.getElementById('us10y-value').textContent = formatValue('us10y-value', data.fixed_income.us10y.value);
    document.getElementById('us10y-change').textContent = `${data.fixed_income.us10y.change.toFixed(2)}%`;
    document.getElementById('us10y-change').className = `metric-change ${data.fixed_income.us10y.change >= 0 ? 'positive' : 'negative'}`;

    document.getElementById('us2y-value').textContent = formatValue('us2y-value', data.fixed_income.us2y.value);
    document.getElementById('us2y-change').textContent = `${data.fixed_income.us2y.change.toFixed(2)}%`;
    document.getElementById('us2y-change').className = `metric-change ${data.fixed_income.us2y.change >= 0 ? 'positive' : 'negative'}`;

    document.getElementById('corp-spread-value').textContent = formatValue('corp-spread', data.fixed_income.corp_spread.value);
    document.getElementById('corp-spread-change').textContent = `${data.fixed_income.corp_spread.change.toFixed(2)}%`;
    document.getElementById('corp-spread-change').className = `metric-change ${data.fixed_income.corp_spread.change >= 0 ? 'positive' : 'negative'}`;

    // Commodities
    document.getElementById('wti-value').textContent = formatValue('wti-value', data.commodities.wti.value);
    document.getElementById('wti-change').textContent = `${data.commodities.wti.change.toFixed(2)} (${(data.commodities.wti.changePercent * 100).toFixed(2)}%)`;
    document.getElementById('wti-change').className = `metric-change ${data.commodities.wti.change >= 0 ? 'positive' : 'negative'}`;

    document.getElementById('gold-value').textContent = formatValue('gold-value', data.commodities.gold.value);
    document.getElementById('gold-change').textContent = `${data.commodities.gold.change.toFixed(2)} (${(data.commodities.gold.changePercent * 100).toFixed(2)}%)`;
    document.getElementById('gold-change').className = `metric-change ${data.commodities.gold.change >= 0 ? 'positive' : 'negative'}`;

    // Macro & Currencies
    document.getElementById('cpi-value').textContent = formatValue('cpi', data.macro_currencies.cpi.value);
    document.getElementById('cpi-change').textContent = `MoM Change: ${data.macro_currencies.cpi.change.toFixed(1)}%`;
    document.getElementById('cpi-change').className = `metric-change ${data.macro_currencies.cpi.change >= 0 ? 'positive' : 'neutral'}`; // CPI change might be neutral

    document.getElementById('unemp-value').textContent = formatValue('unemp', data.macro_currencies.unemp.value);
    document.getElementById('unemp-change').textContent = `MoM Change: ${data.macro_currencies.unemp.change.toFixed(1)}%`;
    document.getElementById('unemp-change').className = `metric-change ${data.macro_currencies.unemp.change <= 0 ? 'positive' : 'negative'}`; // Lower unemployment is positive

    document.getElementById('ffr-value').textContent = formatValue('ffr', data.macro_currencies.ffr.value);
    document.getElementById('ffr-change').textContent = `Change: ${data.macro_currencies.ffr.change.toFixed(2)}%`;
    document.getElementById('ffr-change').className = `metric-change ${data.macro_currencies.ffr.change >= 0 ? 'positive' : 'negative'}`;

    document.getElementById('dxy-value').textContent = formatValue('dxy', data.macro_currencies.dxy.value);
    document.getElementById('dxy-change').textContent = `${data.macro_currencies.dxy.change.toFixed(2)} (${(data.macro_currencies.dxy.changePercent * 100).toFixed(2)}%)`;
    document.getElementById('dxy-change').className = `metric-change ${data.macro_currencies.dxy.change >= 0 ? 'positive' : 'negative'}`;

    // Update last updated timestamp
    document.getElementById('last-updated').textContent = `Last Updated: ${new Date().toLocaleString()}`;
}

// Initial data load and periodic refresh
document.addEventListener('DOMContentLoaded', async () => {
    // Show a loading state
    document.getElementById('last-updated').textContent = 'Loading data...';
    try {
        const data = await fetchData();
        updateDashboard(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById('last-updated').textContent = 'Failed to load data. Please try again later.';
    }

    // In a real daily refresh, you'd trigger fetchData once a day
    // This setInterval is for continuous refresh in the browser for demo purposes.
    // In a production environment, your Cloud Scheduler would trigger the backend daily,
    // and clients would simply load the latest data when they open the page.
    setInterval(async () => {
        console.log("Attempting to refresh data...");
        try {
            const data = await fetchData();
            updateDashboard(data);
        } catch (error) {
            console.error("Error refreshing data:", error);
        }
    }, 30 * 60 * 1000); // Refresh every 30 minutes (for demo purposes)
});
