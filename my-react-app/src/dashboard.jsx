import React, { useState } from 'react';
import StockForm from './components/StockForm';


const Dashboard = () => {
  const [stocks, setStocks] = useState([]);

  const handleAddStock = (newStock) => {
    setStocks((prev) => [...prev, newStock]);
  };

  const handleClearStocks = () => {
    setStocks([]);
  };

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
                </li>
              ))}
            </ul>
            <button className="clear-btn" onClick={handleClearStocks}>
              Clear All
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
