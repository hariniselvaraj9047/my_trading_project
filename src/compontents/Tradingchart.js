import React, { useState, useEffect, useCallback } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Tradingchart.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TradingChart = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedIndicators, setSelectedIndicators] = useState(["50-MA"]);
  const [strategyApplied, setStrategyApplied] = useState(false);

  const generateRandomData = useCallback(() => {
    const dataPoints = 100;
    const prices = [];
    let lastPrice = 50;

    for (let i = 0; i < dataPoints; i++) {
      lastPrice += Math.random() * 4 - 2; // Simulating price movement
      prices.push(lastPrice);
    }

    // Calculate Moving Averages
    const movingAverage50 = calculateMovingAverage(prices, 50);
    const movingAverage20 = calculateMovingAverage(prices, 20);

    // Calculate Bollinger Bands
    const bollingerBands = calculateBollingerBands(prices, 20);

    // Identify Buy Signals (if price crosses MA)
    const buySignals = prices.map((price, index) =>
      index >= 50 && price > movingAverage50[index] ? price : null
    );

    setChartData({
      labels: Array.from({ length: dataPoints }, (_, i) => i),
      datasets: [
        {
          label: "Price",
          data: prices,
          borderColor: "#e3c9e6",
          backgroundColor: "rgba(227, 201, 230, 0.3)",
          borderWidth: 2,
        },
        selectedIndicators.includes("50-MA") && {
          label: "50-Day MA",
          data: movingAverage50,
          borderColor: "#9e7dc4",
          borderWidth: 2,
          borderDash: [5, 5],
        },
        selectedIndicators.includes("20-MA") && {
          label: "20-Day MA",
          data: movingAverage20,
          borderColor: "#f2a65a",
          borderWidth: 2,
          borderDash: [5, 5],
        },
        selectedIndicators.includes("Bollinger") && {
          label: "Upper Bollinger Band",
          data: bollingerBands.upper,
          borderColor: "#5d4c94",
          borderWidth: 1,
          borderDash: [3, 3],
        },
        selectedIndicators.includes("Bollinger") && {
          label: "Lower Bollinger Band",
          data: bollingerBands.lower,
          borderColor: "#5d4c94",
          borderWidth: 1,
          borderDash: [3, 3],
        },
        strategyApplied && {
          label: "Buy Signal",
          data: buySignals,
          borderColor: "#00ff00",
          pointBackgroundColor: "#00ff00",
          pointRadius: 5,
          type: "scatter",
        },
      ].filter(Boolean),
    });
  }, [selectedIndicators, strategyApplied]); // Dependencies added

  useEffect(() => {
    generateRandomData();
  }, [generateRandomData]);

  const calculateMovingAverage = (prices, period) => {
    return prices.map((_, index, arr) => {
      if (index < period) return null;
      const sum = arr.slice(index - period, index).reduce((acc, val) => acc + val, 0);
      return sum / period;
    });
  };

  const calculateBollingerBands = (prices, period) => {
    return prices.map((_, index, arr) => {
      if (index < period) return { upper: null, lower: null };
      const slice = arr.slice(index - period, index);
      const mean = slice.reduce((acc, val) => acc + val, 0) / slice.length;
      const variance = slice.reduce((acc, val) => acc + (val - mean) ** 2, 0) / slice.length;
      const stdDev = Math.sqrt(variance);
      return { upper: mean + 2 * stdDev, lower: mean - 2 * stdDev };
    });
  };

  const toggleIndicator = (indicator) => {
    setSelectedIndicators((prev) =>
      prev.includes(indicator) ? prev.filter((i) => i !== indicator) : [...prev, indicator]
    );
  };

  return (
    <div className="chart-container">
      <h2>Custom Trading Chart</h2>

      <div className="controls">
        <label>Select Indicators:</label>
        <div className="checkbox-group">
          <label>
            <input type="checkbox" checked={selectedIndicators.includes("50-MA")} onChange={() => toggleIndicator("50-MA")} />
            50-Day MA
          </label>
          <label>
            <input type="checkbox" checked={selectedIndicators.includes("20-MA")} onChange={() => toggleIndicator("20-MA")} />
            20-Day MA
          </label>
          <label>
            <input type="checkbox" checked={selectedIndicators.includes("Bollinger")} onChange={() => toggleIndicator("Bollinger")} />
            Bollinger Bands
          </label>
        </div>

        <button onClick={() => setStrategyApplied(!strategyApplied)}>
          {strategyApplied ? "Remove Strategy" : "Apply Buy Signal Strategy"}
        </button>

        <button onClick={generateRandomData}>Refresh Data</button>
      </div>

      {chartData ? <Line data={chartData} /> : <p>Loading chart...</p>}
    </div>
  );
};

export default TradingChart;