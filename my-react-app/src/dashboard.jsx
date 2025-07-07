import React, { useContext } from 'react';
import StockForm from './components/StockForm';
import { StockContext } from './contexts/StockContext';

const Dashboard = () => {
  const { stocks, setStocks } = useContext(StockContext);

  const handleAddStock = (newStock) => {
    setStocks(prev => [...prev, newStock]);
  };

  const handleClearStocks = () => setStocks([]);

  return (
    <div className="dashboard">
      <h2>Finance Dashboard</h2>
      <StockForm onAddStock={handleAddStock} />

      <div className="stock-list">
        <h3>Stock List</h3>
        {stocks.length === 0 ? (
          <p>No stocks added yet.</p>
        ) : (
          <>
            <ul>
              {stocks.map((stock, index) => (
                <li key={index}>
                  {stock.quantity} shares of {stock.symbol} at ${stock.purchasePrice}/share
                  {stock.currentPrice && (
                    <span style={{ marginLeft: '1rem', color: stock.profitLoss >= 0 ? 'limegreen' : 'crimson' }}>
                      → P/L: ${stock.profitLoss.toFixed(2)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <button className="clear-btn" onClick={handleClearStocks}>Clear All</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
