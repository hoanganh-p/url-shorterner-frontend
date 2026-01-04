import React, { useState } from 'react';
import './App.css';
import UrlForm from './components/UrlForm';
import ResultDisplay from './components/ResultDisplay';
import ErrorMessage from './components/ErrorMessage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function App() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [view, setView] = useState('home'); // 'home', 'login', 'register'

  // const API_BASE = 'https://dr69b524xb.execute-api.ap-southeast-1.amazonaws.com/dev';
  const API_BASE = "https://localhost:7241"; 

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
        throw new Error(data?.message || 'Đăng nhập thất bại');
      }

      // Giả sử backend trả về { token: "..." }
      const token = data.token;
      setToken(token);
      localStorage.setItem('token', token);
      setUsername(username);
      localStorage.setItem('username', username);
      setView('home');
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setError('Lỗi kết nối: Server chưa chạy hoặc bị chặn CORS. Hãy kiểm tra console.');
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
        throw new Error(data?.message || 'Đăng ký thất bại');
      }

      // Sau khi đăng ký thành công, tự động đăng nhập hoặc chuyển sang trang login
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      setView('login');
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setError('Lỗi kết nối: Server chưa chạy hoặc bị chặn CORS. Hãy kiểm tra console.');
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

      // Nếu đã đăng nhập, gửi kèm token để backend nhận diện user
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
    } catch (err) {
      setError('Không thể rút gọn URL');
      console.error(err);
    }
  };

  return (
    <>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem', borderBottom: '1px solid #eee', backgroundColor: '#fff', zIndex: 1000, boxSizing: 'border-box' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => { setError(''); setView('home'); }}>URL Shortener</h1>
        <div>
          {!token ? (
            <>
              <button onClick={() => { setError(''); setView('login'); }} style={{ marginRight: '10px' }}>Đăng nhập</button>
              <button onClick={() => { setError(''); setView('register'); }}>Đăng ký</button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '15px', fontWeight: '500' }}>Xin chào, {username}</span>
              <button onClick={handleLogout}>Đăng xuất</button>
            </div>
          )}
        </div>
      </nav>

      <div className="container" style={{ marginTop: '80px' }}>
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
    </>
  );
}

export default App;
