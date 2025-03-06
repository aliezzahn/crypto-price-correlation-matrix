import React, { useState, useEffect } from "react";
import { Sun, Moon, Home, TrendingUp, PieChart, Settings } from "lucide-react";
import _ from "lodash";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Main App Component
const CryptoCorrelationMatrix = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [cryptoData, setCryptoData] = useState([]);
  const [correlationMatrix, setCorrelationMatrix] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [historicalCorrelations, setHistoricalCorrelations] = useState([]);
  const [portfolioAllocation, setPortfolioAllocation] = useState({
    bitcoin: 40,
    ethereum: 30,
    ripple: 10,
    cardano: 10,
    solana: 5,
    polkadot: 5,
  });

  // Simulate fetching crypto data
  useEffect(() => {
    // Mock data - in a real app, you would fetch from a crypto API
    const mockCryptoData = [
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        data: [45000, 46000, 44000, 47000, 48000, 46500, 47200],
        color: "#F7931A",
      },
      {
        id: "ethereum",
        name: "Ethereum",
        symbol: "ETH",
        data: [3200, 3300, 3100, 3400, 3500, 3450, 3480],
        color: "#627EEA",
      },
      {
        id: "ripple",
        name: "Ripple",
        symbol: "XRP",
        data: [0.75, 0.78, 0.72, 0.8, 0.82, 0.79, 0.81],
        color: "#23292F",
      },
      {
        id: "cardano",
        name: "Cardano",
        symbol: "ADA",
        data: [1.2, 1.25, 1.18, 1.3, 1.35, 1.28, 1.32],
        color: "#3CC8C8",
      },
      {
        id: "solana",
        name: "Solana",
        symbol: "SOL",
        data: [150, 155, 145, 160, 165, 158, 162],
        color: "#00FFA3",
      },
      {
        id: "polkadot",
        name: "Polkadot",
        symbol: "DOT",
        data: [22, 23, 21, 24, 25, 23.5, 24.2],
        color: "#E6007A",
      },
    ];

    setCryptoData(mockCryptoData);

    // Calculate correlation matrix
    const matrix = calculateCorrelationMatrix(mockCryptoData);
    setCorrelationMatrix(matrix);

    // Generate historical correlation data for trends
    generateHistoricalData(mockCryptoData);

    setIsLoading(false);
  }, []);

  // Generate mock historical data for trends
  const generateHistoricalData = (cryptoData) => {
    // Create mock data for BTC-ETH correlation over time
    const periods = [
      "Week 1",
      "Week 2",
      "Week 3",
      "Week 4",
      "Week 5",
      "Week 6",
      "Week 7",
      "Week 8",
    ];
    const btcEthCorr = [0.82, 0.79, 0.85, 0.87, 0.83, 0.76, 0.81, 0.84];
    const btcXrpCorr = [0.65, 0.58, 0.62, 0.71, 0.67, 0.58, 0.63, 0.67];
    const ethAdaCorr = [0.78, 0.75, 0.81, 0.83, 0.79, 0.72, 0.76, 0.8];

    const historicalData = [
      {
        id: "BTC-ETH",
        name: "Bitcoin-Ethereum",
        color: "#F7931A",
        data: periods.map((period, index) => ({
          period,
          correlation: btcEthCorr[index],
        })),
      },
      {
        id: "BTC-XRP",
        name: "Bitcoin-Ripple",
        color: "#627EEA",
        data: periods.map((period, index) => ({
          period,
          correlation: btcXrpCorr[index],
        })),
      },
      {
        id: "ETH-ADA",
        name: "Ethereum-Cardano",
        color: "#3CC8C8",
        data: periods.map((period, index) => ({
          period,
          correlation: ethAdaCorr[index],
        })),
      },
    ];

    setHistoricalCorrelations(historicalData);
  };

  // Calculate Pearson correlation coefficient
  const calculateCorrelation = (x, y) => {
    const n = x.length;
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumX2 = 0,
      sumY2 = 0;

    for (let i = 0; i < n; i++) {
      sumX += x[i];
      sumY += y[i];
      sumXY += x[i] * y[i];
      sumX2 += x[i] * x[i];
      sumY2 += y[i] * y[i];
    }

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  };

  // Calculate correlation matrix for all cryptocurrencies
  const calculateCorrelationMatrix = (data) => {
    const matrix = [];

    for (let i = 0; i < data.length; i++) {
      const row = [];
      for (let j = 0; j < data.length; j++) {
        const correlation = calculateCorrelation(data[i].data, data[j].data);
        row.push(parseFloat(correlation.toFixed(2)));
      }
      matrix.push(row);
    }

    return matrix;
  };

  // Calculate portfolio risk score based on correlations and allocations
  const calculatePortfolioRisk = () => {
    let riskScore = 0;
    let totalAllocation = 0;

    // Calculate weighted average correlation
    for (let i = 0; i < cryptoData.length; i++) {
      const cryptoId1 = cryptoData[i].id;
      const allocation1 = portfolioAllocation[cryptoId1] || 0;
      totalAllocation += allocation1;

      for (let j = 0; j < cryptoData.length; j++) {
        if (i !== j) {
          const cryptoId2 = cryptoData[j].id;
          const allocation2 = portfolioAllocation[cryptoId2] || 0;
          const correlation = correlationMatrix[i][j];

          // Weight the correlation by the product of allocations
          riskScore += correlation * allocation1 * allocation2;
        }
      }
    }

    // Normalize
    riskScore = riskScore / (totalAllocation * totalAllocation);
    return parseFloat(riskScore.toFixed(2));
  };

  // Toggle theme function
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Color for correlation values
  const getCorrelationColor = (value) => {
    if (value === 1) return darkMode ? "#8be9fd" : "#0077b6";
    if (value > 0.8) return darkMode ? "#bd93f9" : "#0096c7";
    if (value > 0.6) return darkMode ? "#ff79c6" : "#00b4d8";
    if (value > 0.4) return darkMode ? "#ffb86c" : "#48cae4";
    if (value > 0.2) return darkMode ? "#f1fa8c" : "#90e0ef";
    if (value > 0) return darkMode ? "#50fa7b" : "#ade8f4";
    if (value > -0.2) return darkMode ? "#8be9fd" : "#caf0f8";
    if (value > -0.4) return darkMode ? "#bd93f9" : "#d9f2f4";
    if (value > -0.6) return darkMode ? "#ff79c6" : "#f0f9fa";
    if (value > -0.8) return darkMode ? "#ffb86c" : "#fee440";
    return darkMode ? "#ff5555" : "#f94144";
  };

  // Handle portfolio allocation change
  const handleAllocationChange = (cryptoId, value) => {
    setPortfolioAllocation({
      ...portfolioAllocation,
      [cryptoId]: parseInt(value, 10),
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div>
            <h2
              className={`text-2xl font-bold mb-4 ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Crypto Price Correlation Matrix
            </h2>
            <p
              className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Visualize how different cryptocurrencies move in relation to each
              other. This tool helps investors understand market
              interdependencies and build diversified portfolios.
            </p>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div
                  className={`text-lg ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Loading data...
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table
                  className={`min-w-full border-collapse ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <thead>
                    <tr>
                      <th
                        className={`px-2 py-2 ${
                          darkMode ? "bg-gray-800" : "bg-gray-100"
                        }`}
                      >
                        Crypto
                      </th>
                      {cryptoData.map((crypto) => (
                        <th
                          key={crypto.id}
                          className={`px-2 py-2 ${
                            darkMode ? "bg-gray-800" : "bg-gray-100"
                          }`}
                        >
                          {crypto.symbol}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cryptoData.map((crypto, i) => (
                      <tr key={crypto.id}>
                        <td
                          className={`px-2 py-2 font-medium ${
                            darkMode ? "bg-gray-800" : "bg-gray-100"
                          }`}
                        >
                          {crypto.symbol}
                        </td>
                        {correlationMatrix[i]?.map((value, j) => (
                          <td
                            key={j}
                            className="px-2 py-2 text-center"
                            style={{
                              backgroundColor: getCorrelationColor(value),
                              color:
                                Math.abs(value) > 0.6
                                  ? "#fff"
                                  : darkMode
                                  ? "#f8f8f2"
                                  : "#333",
                            }}
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-6">
              <h3
                className={`text-xl font-bold mb-2 ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                How to Read This Matrix
              </h3>
              <ul
                className={`list-disc pl-5 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <li>Values range from -1 to 1</li>
                <li>1: Perfect positive correlation (move together)</li>
                <li>0: No correlation (move independently)</li>
                <li>
                  -1: Perfect negative correlation (move in opposite directions)
                </li>
              </ul>
            </div>
          </div>
        );
      case "trends":
        return (
          <div>
            <h2
              className={`text-2xl font-bold mb-4 ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Correlation Trends
            </h2>
            <p
              className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Analysis of how crypto correlations have changed over time and
              what trends we can identify.
            </p>

            {historicalCorrelations.map((item) => (
              <div
                key={item.id}
                className={`mb-8 p-4 rounded-lg ${
                  darkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {item.name} Correlation Over Time
                </h3>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={item.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="correlation"
                      stroke={item.color}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>

                <div
                  className={`text-sm mt-4 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {item.id === "BTC-ETH"
                    ? "Bitcoin and Ethereum show consistently high correlation, suggesting similar market drivers affect both cryptocurrencies."
                    : item.id === "BTC-XRP"
                    ? "Bitcoin and Ripple exhibit moderate correlation, fluctuating more than BTC-ETH, indicating XRP sometimes moves independently."
                    : "Ethereum and Cardano correlation has strengthened over time, suggesting growing market integration between these platforms."}
                </div>
              </div>
            ))}

            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-3 ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Key Correlation Trends
              </h3>
              <ul
                className={`list-disc pl-5 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <li className="mb-2">
                  Overall crypto market correlation has increased during market
                  downturns
                </li>
                <li className="mb-2">
                  Layer-1 blockchain tokens show stronger intra-group
                  correlation
                </li>
                <li className="mb-2">
                  Bitcoin's correlation with other assets tends to decrease
                  during extreme market events
                </li>
                <li className="mb-2">
                  DeFi tokens exhibit variable correlation patterns depending on
                  market conditions
                </li>
              </ul>
            </div>
          </div>
        );
      case "portfolio":
        return (
          <div>
            <h2
              className={`text-2xl font-bold mb-4 ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Portfolio Diversification
            </h2>
            <p
              className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Tools to help create a diversified crypto portfolio based on
              correlation data.
            </p>

            {/* Portfolio Risk Score */}
            <div
              className={`mb-6 p-4 rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-2 ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Portfolio Risk Score
              </h3>
              <div className="flex items-center justify-between">
                <div
                  className={`text-3xl font-bold ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {calculatePortfolioRisk()}
                </div>
                <div
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {calculatePortfolioRisk() > 0.7
                    ? "High Risk"
                    : calculatePortfolioRisk() > 0.4
                    ? "Moderate Risk"
                    : "Low Risk"}
                </div>
              </div>
              <p
                className={`mt-2 text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                This score measures overall portfolio risk based on asset
                correlations and allocations. Lower values indicate better
                diversification.
              </p>
            </div>

            {/* Portfolio Allocation */}
            <div
              className={`mb-6 p-4 rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Current Allocation
              </h3>

              {/* Visual representation of current allocation */}
              <div className="relative h-8 mb-6 rounded-full overflow-hidden">
                {cryptoData.map((crypto, index) => {
                  const allocation = portfolioAllocation[crypto.id] || 0;
                  let width = 0;
                  let left = 0;

                  // Calculate position and width
                  for (let i = 0; i < index; i++) {
                    left += portfolioAllocation[cryptoData[i].id] || 0;
                  }
                  width = allocation;

                  return (
                    <div
                      key={crypto.id}
                      className="absolute h-full"
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        backgroundColor: crypto.color || "#ccc",
                      }}
                    ></div>
                  );
                })}
              </div>

              {/* Allocation sliders */}
              {cryptoData.map((crypto) => (
                <div key={crypto.id} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <label
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {crypto.name}
                    </label>
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {portfolioAllocation[crypto.id] || 0}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={portfolioAllocation[crypto.id] || 0}
                    onChange={(e) =>
                      handleAllocationChange(crypto.id, e.target.value)
                    }
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-300 dark:bg-gray-700"
                  />
                </div>
              ))}
            </div>

            {/* Diversification Recommendations */}
            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-3 ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Diversification Recommendations
              </h3>
              <ul className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                <li className="mb-2 flex items-start">
                  <span
                    className={`inline-block w-5 h-5 mr-2 rounded-full flex items-center justify-center text-white ${
                      calculatePortfolioRisk() > 0.6
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  >
                    {calculatePortfolioRisk() > 0.6 ? "!" : "✓"}
                  </span>
                  {calculatePortfolioRisk() > 0.6
                    ? "Consider reducing your combined BTC/ETH allocation to improve diversification."
                    : "Your portfolio has good diversification across major assets."}
                </li>
                <li className="mb-2 flex items-start">
                  <span
                    className={`inline-block w-5 h-5 mr-2 rounded-full flex items-center justify-center text-white ${
                      portfolioAllocation.solana < 10
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    {portfolioAllocation.solana < 10 ? "!" : "✓"}
                  </span>
                  {portfolioAllocation.solana < 10
                    ? "Increasing your Solana allocation could improve diversification as it has lower correlation with BTC."
                    : "Your Solana allocation helps balance portfolio correlation."}
                </li>
                <li className="mb-2 flex items-start">
                  <span className="inline-block w-5 h-5 mr-2 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    i
                  </span>
                  {`Consider adding stablecoins (0% correlation) for additional diversification in volatile markets.`}
                </li>
              </ul>
            </div>
          </div>
        );
      case "settings":
        return (
          <div>
            <h2
              className={`text-2xl font-bold mb-4 ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Settings
            </h2>
            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <span className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  Dark Mode
                </span>
                <button
                  onClick={toggleTheme}
                  className={`px-4 py-2 rounded-md ${
                    darkMode
                      ? "bg-purple-600 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {darkMode ? "Enabled" : "Disabled"}
                </button>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  Data Source
                </span>
                <select
                  className={`px-4 py-2 rounded-md ${
                    darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <option>CoinGecko API</option>
                  <option>CoinMarketCap API</option>
                  <option>Binance API</option>
                </select>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  Time Period
                </span>
                <select
                  className={`px-4 py-2 rounded-md ${
                    darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <option>7 Days</option>
                  <option>30 Days</option>
                  <option>90 Days</option>
                  <option>1 Year</option>
                </select>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header with theme toggle */}
      <header
        className={`px-4 py-4 shadow-md ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">CryptoCorrelation</h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-yellow-300"
                : "bg-gray-100 text-gray-600"
            }`}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 mb-16">
        {renderContent()}
      </main>

      {/* Bottom navigation menu */}
      <nav
        className={`fixed bottom-0 left-0 right-0 shadow-lg ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="container mx-auto">
          <ul className="flex justify-around py-3">
            <li>
              <button
                onClick={() => setActiveTab("home")}
                className={`flex flex-col items-center ${
                  activeTab === "home"
                    ? darkMode
                      ? "text-purple-400"
                      : "text-blue-500"
                    : darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                <Home size={24} />
                <span className="text-xs mt-1">Home</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("trends")}
                className={`flex flex-col items-center ${
                  activeTab === "trends"
                    ? darkMode
                      ? "text-purple-400"
                      : "text-blue-500"
                    : darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                <TrendingUp size={24} />
                <span className="text-xs mt-1">Trends</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("portfolio")}
                className={`flex flex-col items-center ${
                  activeTab === "portfolio"
                    ? darkMode
                      ? "text-purple-400"
                      : "text-blue-500"
                    : darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                <PieChart size={24} />
                <span className="text-xs mt-1">Portfolio</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex flex-col items-center ${
                  activeTab === "settings"
                    ? darkMode
                      ? "text-purple-400"
                      : "text-blue-500"
                    : darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                <Settings size={24} />
                <span className="text-xs mt-1">Settings</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default CryptoCorrelationMatrix;
