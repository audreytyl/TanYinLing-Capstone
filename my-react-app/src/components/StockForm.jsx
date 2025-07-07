import React, { useState } from 'react';

const StockForm = ({ onAddStock }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    quantity: '',
    purchasePrice: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddStock(formData);
    setFormData({ symbol: '', quantity: '', purchasePrice: '' }); 
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '20px auto' }}>
      <label>
        Stock Symbol:
        <input
          type="text"
          name="symbol"
          value={formData.symbol}
          onChange={handleChange}
          placeholder="e.g. AAPL"
          required
        />
      </label>
      <br />
      <label>
        Quantity of Shares:
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="e.g. 10"
          required
        />
      </label>
      <br />
      <label>
        Purchase Price per Share:
        <input
          type="number"
          step="0.01"
          name="purchasePrice"
          value={formData.purchasePrice}
          onChange={handleChange}
          placeholder="e.g. 150.00"
          required
        />
      </label>
      <br />
      <button type="submit">Add Stock</button>
    </form>
  );
};

export default StockForm;
