#!/usr/bin/env node

/**
 * Generate DCA simulation data from Polygon.io historical prices
 *
 * Usage: POLYGON_API_KEY=your_key node scripts/generate-dca-data.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.POLYGON_API_KEY;
if (!API_KEY) {
  console.error('Error: POLYGON_API_KEY environment variable required');
  console.error('Usage: POLYGON_API_KEY=your_key node scripts/generate-dca-data.js');
  process.exit(1);
}

// Configuration
const CONFIG = {
  tickers: ['NVDA', 'GOOGL', 'TSLA'],
  startDate: '2016-01-01', // 10 years ago
  endDate: new Date().toISOString().split('T')[0], // Today
  monthlyInvestment: 100, // EUR per month, split equally
  goalTarget: 200000,
  usdToEur: 0.92, // Approximate conversion rate
};

async function fetchMonthlyPrices(ticker) {
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/month/${CONFIG.startDate}/${CONFIG.endDate}?adjusted=true&sort=asc&apiKey=${API_KEY}`;

  console.log(`Fetching ${ticker}...`);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${ticker}: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.status !== 'OK' || !data.results) {
    throw new Error(`Invalid response for ${ticker}: ${data.status}`);
  }

  return data.results.map(bar => ({
    date: new Date(bar.t).toISOString().slice(0, 7), // YYYY-MM
    close: bar.c * CONFIG.usdToEur, // Convert to EUR
  }));
}

function simulateDCA(priceData) {
  const snapshots = [];
  const holdings = {};

  // Initialize holdings for each ticker
  CONFIG.tickers.forEach(ticker => {
    holdings[ticker] = {
      shares: 0,
      costBasis: 0,
    };
  });

  // Get all unique months from price data
  const months = [...new Set(priceData[CONFIG.tickers[0]].map(p => p.date))];

  const investmentPerStock = CONFIG.monthlyInvestment / CONFIG.tickers.length;

  months.forEach((month, monthIndex) => {
    // Invest in each stock
    CONFIG.tickers.forEach(ticker => {
      const priceEntry = priceData[ticker].find(p => p.date === month);
      if (priceEntry) {
        const sharesBought = investmentPerStock / priceEntry.close;
        holdings[ticker].shares += sharesBought;
        holdings[ticker].costBasis += investmentPerStock;
      }
    });

    // Calculate current values
    const holdingsSnapshot = CONFIG.tickers.map(ticker => {
      const priceEntry = priceData[ticker].find(p => p.date === month);
      const currentPrice = priceEntry ? priceEntry.close : 0;
      const currentValue = holdings[ticker].shares * currentPrice;
      const gain = holdings[ticker].costBasis > 0
        ? ((currentValue - holdings[ticker].costBasis) / holdings[ticker].costBasis) * 100
        : 0;

      return {
        symbol: ticker,
        name: getTickerName(ticker),
        abbrev: getTickerAbbrev(ticker),
        shares: Math.round(holdings[ticker].shares * 100) / 100,
        value: Math.round(currentValue),
        gain: Math.round(gain * 10) / 10,
      };
    });

    const totalValue = holdingsSnapshot.reduce((sum, h) => sum + h.value, 0);
    const totalCost = (monthIndex + 1) * CONFIG.monthlyInvestment;
    const totalGain = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;

    snapshots.push({
      date: month,
      monthLabel: formatMonthLabel(month),
      totalValue: Math.round(totalValue),
      totalCost: Math.round(totalCost),
      totalGain: Math.round(totalGain * 10) / 10,
      progressPercent: Math.min(Math.round((totalValue / CONFIG.goalTarget) * 100), 100),
      holdings: holdingsSnapshot,
    });
  });

  return snapshots;
}

function getTickerName(ticker) {
  const names = {
    'NVDA': 'NVIDIA',
    'GOOGL': 'Google',
    'TSLA': 'Tesla',
  };
  return names[ticker] || ticker;
}

function getTickerAbbrev(ticker) {
  const abbrevs = {
    'NVDA': 'NV',
    'GOOGL': 'GO',
    'TSLA': 'TS',
  };
  return abbrevs[ticker] || ticker.slice(0, 2);
}

function formatMonthLabel(dateStr) {
  const [year, month] = dateStr.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
}

async function main() {
  console.log('Generating DCA simulation data...\n');
  console.log(`Tickers: ${CONFIG.tickers.join(', ')}`);
  console.log(`Period: ${CONFIG.startDate} to ${CONFIG.endDate}`);
  console.log(`Monthly investment: €${CONFIG.monthlyInvestment}\n`);

  try {
    // Fetch price data for all tickers
    const priceData = {};
    for (const ticker of CONFIG.tickers) {
      priceData[ticker] = await fetchMonthlyPrices(ticker);
      // Rate limit: wait 200ms between requests
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Simulate DCA
    const snapshots = simulateDCA(priceData);

    // Build output
    const output = {
      generatedAt: new Date().toISOString(),
      config: {
        tickers: CONFIG.tickers,
        startDate: CONFIG.startDate,
        monthlyInvestment: CONFIG.monthlyInvestment,
        goalTarget: CONFIG.goalTarget,
      },
      snapshots,
    };

    // Write to file
    const outputPath = path.join(__dirname, '../src/data/dca-simulation.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log(`\nGenerated ${snapshots.length} monthly snapshots`);
    console.log(`Output: ${outputPath}`);

    // Show summary
    const latest = snapshots[snapshots.length - 1];
    console.log(`\nLatest snapshot (${latest.monthLabel}):`);
    console.log(`  Total invested: €${latest.totalCost}`);
    console.log(`  Current value: €${latest.totalValue}`);
    console.log(`  Total gain: ${latest.totalGain > 0 ? '+' : ''}${latest.totalGain}%`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
