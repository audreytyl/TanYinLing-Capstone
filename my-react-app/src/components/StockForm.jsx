import React, { useState, useCallback } from 'react';

const API_KEY = '95LP58O5EBNA5692';

const StockForm = ({ onAddStock }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    quantity: '',
    purchasePrice: ''
  });

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setResult(null);

    if (name === 'symbol' && value.length >= 2) {
      fetchSuggestions(value);
    } else if (name === 'symbol') {
      setSuggestions([]);
    }
  };

  const fetchSuggestions = useCallback(async (query) => {
    try {
      const res = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`
      );
      const data = await res.json();
      const matches =
        data.bestMatches?.map((match) => ({
          symbol: match['1. symbol'],
          name: match['2. name']
        })) || [];
      setSuggestions(matches.slice(0, 5));
    } catch {
      setSuggestions([]);
    }
  }, []);

  const fetchCurrentPrice = useCallback(async (symbol) => {
    try {
      const res = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
      );
      const data = await res.json();
      return parseFloat(data['Global Quote']?.['05. price']);
    } catch {
      return null;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { symbol, quantity, purchasePrice } = formData;

    if (!symbol || !quantity || !purchasePrice) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const currentPrice = await fetchCurrentPrice(symbol);
    if (!currentPrice || isNaN(currentPrice)) {
      setError('No stocks available for the entered symbol.');
      setLoading(false);
      return;
    }

    const profitLoss =
      (currentPrice - parseFloat(purchasePrice)) * parseInt(quantity);
    setResult({ profitLoss, currentPrice });

    onAddStock({
      ...formData,
      currentPrice,
      profitLoss,
      timestamp: new Date().toISOString()
    });

    setFormData({ symbol: '', quantity: '', purchasePrice: '' });
    setSuggestions([]);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Stock Symbol:
        <input
          type="text"
          name="symbol"
          value={formData.symbol}
          onChange={handleChange}
          placeholder="e.g. AAPL"
          autoComplete="off"
          required
        />
        {suggestions.length > 0 && (
          <ul
            style={{
              background: '#1e1e1e',
              padding: '0.5rem',
              marginTop: '0.3rem',
              borderRadius: '6px',
              listStyle: 'none',
              border: '1px solid #444'
            }}
          >
            {suggestions.map((s, i) => (
              <li
                key={i}
                style={{
                  cursor: 'pointer',
                  padding: '0.4rem',
                  color: '#ffa500'
                }}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, symbol: s.symbol }));
                  setSuggestions([]);
                }}
              >
                <strong>{s.symbol}</strong> — {s.name}
              </li>
            ))}
          </ul>
        )}
      </label>

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

      <label>
        Purchase Price per Share:
        <input
          type="number"
          name="purchasePrice"
          value={formData.purchasePrice}
          onChange={handleChange}
          placeholder="e.g. 150.00"
          step="0.01"
          required
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Stock'}
      </button>

      {error && (
        <p style={{ color: 'tomato', marginTop: '1rem' }}>{error}</p>
      )}

      {result && (
        <p
          style={{
            marginTop: '1rem',
            fontWeight: 'bold',
            color: result.profitLoss >= 0 ? 'limegreen' : 'crimson'
          }}
        >
          Profit/Loss: ${result.profitLoss.toFixed(2)} | Current Price: $
          {result.currentPrice.toFixed(2)}
        </p>
      )}
    </form>
  );
};

export default StockForm;
