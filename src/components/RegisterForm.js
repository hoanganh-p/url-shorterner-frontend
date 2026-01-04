import React, { useState } from 'react';

const RegisterForm = ({ onRegister, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(username, email, password);
  };

  return (
    <div className="auth-container">
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            placeholder="Tên đăng nhập"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="Nhập email đăng ký"
          />
        </div>
        <div className="form-group">
          <label>Mật khẩu:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="Tạo mật khẩu"
          />
        </div>
        <button type="submit">Đăng ký</button>
      </form>
      <p style={{marginTop: '10px'}}>
        Đã có tài khoản? <button type="button" style={{background:'none', border:'none', color:'blue', cursor:'pointer', textDecoration:'underline'}} onClick={onSwitchToLogin}>Đăng nhập</button>
      </p>
    </div>
  );
};

export default RegisterForm;