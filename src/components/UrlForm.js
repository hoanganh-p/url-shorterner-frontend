import React, { useState } from 'react';

function UrlForm({ onSubmit }) {
  const [longUrl, setLongUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedUrl = longUrl.trim();
    if (trimmedUrl) {
      onSubmit(trimmedUrl);
      setLongUrl('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        type="url"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
        placeholder="Nhập URL cần rút gọn"
        required
      />
      <button type="submit">Rút gọn</button>
    </form>
  );
}

export default UrlForm;
