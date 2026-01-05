import React, { useState, useEffect } from 'react';
import './App.css';
import './styles/Navbar.css';
import UrlForm from './components/UrlForm';
import ResultDisplay from './components/ResultDisplay';
import ErrorMessage from './components/ErrorMessage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import UserUrls from './components/UserUrls';

function App() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [view, setView] = useState('home'); // 'home', 'login', 'register'
  const [userUrls, setUserUrls] = useState([]);

  // const API_BASE = 'https://dr69b524xb.execute-api.ap-southeast-1.amazonaws.com/dev';
  const API_BASE = "https://localhost:7241"; 

  const fetchHistory = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/url/user/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setUserUrls(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, [token]);

  const handleLogin = async (username, password) => {
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || 'Login failed');
      }

      // Assuming backend returns { token: "..." }
      const token = data.token;
      setToken(token);
      localStorage.setItem('token', token);
      setUsername(username);
      localStorage.setItem('username', username);
      setView('home');
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setError('Connection error: Server not running or CORS blocked. Check console.');
      } else {
        setError(err.message);
      }
      console.error(err);
    }
  };

  const handleRegister = async (username, email, password) => {
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || 'Registration failed');
      }

      // After successful registration, auto login or switch to login page
      alert('Registration successful! Please login.');
      setView('login');
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setError('Connection error: Server not running or CORS blocked. Check console.');
      } else {
        setError(err.message);
      }
      console.error(err);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setUsername(null);
    localStorage.removeItem('username');
    setUserUrls([]);
    setResult(null);
    setError('');
  };

  const handleShorten = async (longUrl) => {
    setError('');
    setResult(null);

    try {
      const headers = {
        'Content-Type': 'application/json'
      };

      // If logged in, send token for backend user identification
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}/api/url/create`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          originalUrl: longUrl
        })
      });

      if (!res.ok) {
        throw new Error('Create failed');
      }

      const data = await res.json();
      setResult(data);
      if (token) {
        fetchHistory();
      }
    } catch (err) {
      setError('Cannot shorten URL');
      console.error(err);
    }
  };

  const handleDeleteUrl = async (shortCode) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/url/${shortCode}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setUserUrls(prevUrls => prevUrls.filter(url => url.shortCode !== shortCode));
      } else {
        alert('Cannot delete URL. URL might not exist or you do not have permission.');
      }
    } catch (err) {
      console.error('Error deleting:', err);
      alert('An error occurred while connecting to the server.');
    }
  };

  return (
    <>
      <nav className="navbar">
        <h1 className="nav-brand" onClick={() => { setError(''); setView('home'); }}>URL Shortener</h1>
        <div>
          {!token ? (
            <>
              <button onClick={() => { setError(''); setView('login'); }} style={{ marginRight: '10px' }}>Login</button>
              <button onClick={() => { setError(''); setView('register'); }}>Register</button>
            </>
          ) : (
            <div className="nav-user">
              <span style={{ marginRight: '15px', fontWeight: '500' }}>Hello, {username}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      <div className="container main-container">
        <ErrorMessage message={error} />

        {view === 'home' && (
          <>
            <UrlForm onSubmit={handleShorten} />
            <ResultDisplay result={result} />
          </>
        )}

        {view === 'login' && <LoginForm onLogin={handleLogin} onSwitchToRegister={() => { setError(''); setView('register'); }} />}
        {view === 'register' && <RegisterForm onRegister={handleRegister} onSwitchToLogin={() => { setError(''); setView('login'); }} />}
      </div>

      {view === 'home' && token && (
        <div className="history-container">
          <UserUrls urls={userUrls} onDelete={handleDeleteUrl} />
        </div>
      )}
    </>
  );
}

export default App;
