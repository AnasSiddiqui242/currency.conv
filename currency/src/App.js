import React, { useState, useEffect } from 'react';
import './App.css';


const App = () => {
  const [rates, setRates] = useState({});
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);
  const [countryFlags, setCountryFlags] = useState({});

  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then((response) => response.json())
      .then((data) => setRates(data.rates))
      .catch((error) => console.error('Error fetching exchange rates:', error));
    
    fetch('https://restcountries.com/v3.1/all')
      .then((response) => response.json())
      .then((data) => {
        const flags = data.reduce((acc, country) => {
          acc[country.currencies && Object.keys(country.currencies)[0]] = country.flags.svg;
          return acc;
        }, {});
        setCountryFlags(flags);
      })
      .catch((error) => console.error('Error fetching country flags:', error));
  }, []);

  const handleConvert = () => {
    if (fromCurrency !== toCurrency) {
      const conversionRate = rates[toCurrency] / rates[fromCurrency];
      setResult((amount * conversionRate).toFixed(2));
    } else {
      setResult(amount.toFixed(2));
    }
  };

  return (
    <div className="App">
      <h1>Currency Converter</h1>
      <div className="converter">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="flag-select">
          {countryFlags[fromCurrency] && (
            <img src={countryFlags[fromCurrency]} alt={`${fromCurrency} flag`} />
          )}
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {Object.keys(rates).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <span>to</span>
        <div className="flag-select">
          {countryFlags[toCurrency] && (
            <img src={countryFlags[toCurrency]} alt={`${toCurrency} flag`} />
          )}
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {Object.keys(rates).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleConvert}>Convert</button>
      </div>
      {result && (
        <div className={`result ${result ? 'show' : ''}`}>
          <h2>
            {amount} {fromCurrency} = {result} {toCurrency}
          </h2>
        </div>
      )}
    </div>
  );

};



export default App;
