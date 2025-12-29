import React, { useState } from 'react';
import './App.css';
import UrlForm from './components/UrlForm';
import ResultDisplay from './components/ResultDisplay';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleShorten = async (longUrl) => {
    setError('');
    setResult(null);

    // const API_BASE = 'https://dr69b524xb.execute-api.ap-southeast-1.amazonaws.com/dev';
    const API_BASE = "https://localhost:7241"; 
    try {
      const res = await fetch(`${API_BASE}/api/url/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          originalUrl: longUrl
        })
      });

      if (!res.ok) {
        throw new Error('Create failed');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError('Không thể rút gọn URL');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>URL Shortener</h1>
      <UrlForm onSubmit={handleShorten} />
      <ErrorMessage message={error} />
      <ResultDisplay result={result} />
    </div>
  );
}

export default App;
