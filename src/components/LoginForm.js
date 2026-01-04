import React, { useState } from 'react';

const LoginForm = ({ onLogin, onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="auth-container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            placeholder="Nhập tên đăng nhập"
          />
        </div>
        <div className="form-group">
          <label>Mật khẩu:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="Nhập mật khẩu"
          />
        </div>
        <button type="submit">Đăng nhập</button>
      </form>
      <p style={{marginTop: '10px'}}>
        Chưa có tài khoản? <button type="button" style={{background:'none', border:'none', color:'blue', cursor:'pointer', textDecoration:'underline'}} onClick={onSwitchToRegister}>Đăng ký ngay</button>
      </p>
    </div>
  );
};

export default LoginForm;